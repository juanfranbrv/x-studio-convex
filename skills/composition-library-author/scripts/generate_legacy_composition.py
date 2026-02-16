#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import random
import re
from pathlib import Path
from typing import Any

VALID_INTENTS = [
    "oferta", "escaparate", "catalogo", "lanzamiento", "servicio",
    "comunicado", "evento", "lista", "comparativa", "efemeride",
    "equipo", "cita", "talento", "logro", "bts",
    "dato", "pasos", "definicion", "pregunta", "reto",
]

SKILL_VERSION = "1.1.0"
TEXT_ZONE_BY_ARCHETYPE = {
    "grid_bento": "left",
    "split_hero": "left",
    "radial_spotlight": "bottom",
    "process_z": "top",
    "stacked_cards": "bottom",
    "diagonal_energy": "right",
    "timeline_vertical": "left",
    "checklist_blocks": "top",
    "before_after": "top",
    "hub_spoke": "center",
}

ARCHETYPES: dict[str, dict[str, Any]] = {
    "grid_bento": {
        "id_token": "grid-bento",
        "name": "Mosaico de Valor",
        "description": "Reticula irregular con foco principal y modulos de apoyo.",
        "prompt_instruction": "Modular bento-style composition with one dominant pane and organized supporting cells.",
        "thumbnail_family": "grid",
        "id_tokens": ["grid", "mosaic", "catalogo"],
        "basic_friendly": True,
        "structural_lines": [
            "Define una celda dominante para el mensaje principal y evita competir con apoyos secundarios.",
            "Reserva una franja limpia para texto continuo fuera del bloque dominante.",
            "Distribuye modulos secundarios con separaciones claras y jerarquia de tamano.",
            "Mantiene ritmo visual estable sin superponer piezas en la zona de lectura.",
            "Ancla el logo principal en base con presencia discreta.",
        ],
    },
    "split_hero": {
        "id_token": "split-hero",
        "name": "Split Hero",
        "description": "Escena partida con protagonista y columna funcional.",
        "prompt_instruction": "Asymmetric split composition with hero panel and protected text lane.",
        "thumbnail_family": "split",
        "id_tokens": ["split", "benefit", "versus"],
        "basic_friendly": True,
        "structural_lines": [
            "Divide el lienzo en dos zonas asimetricas y da prioridad al bloque hero.",
            "Protege un carril de texto estable en el lado secundario.",
            "Usa contrastes de escala, no de ruido, para separar jerarquia.",
            "Evita cruces diagonales que invadan la lectura principal.",
            "Mantiene logos en esquinas opuestas con peso claramente secundario.",
        ],
    },
    "radial_spotlight": {
        "id_token": "radial-spotlight",
        "name": "Foco Radial",
        "description": "Centro protagonista con ondas de apoyo periferico.",
        "prompt_instruction": "Radial spotlight composition with central focus and controlled orbit supports.",
        "thumbnail_family": "radial",
        "id_tokens": ["radial", "spotlight", "hero"],
        "basic_friendly": False,
        "structural_lines": [
            "Ubica el foco visual principal en centro y despeja un anillo de respiracion.",
            "Distribuye apoyos en periferia sin competir con el nucleo.",
            "Reserva texto en una banda limpia fuera del eje radial.",
            "Controla conectores para sugerir energia sin saturacion.",
            "Ancla logo principal en base y evita marcas dentro del nucleo.",
        ],
    },
    "process_z": {
        "id_token": "process-z",
        "name": "Ruta en Z",
        "description": "Recorrido secuencial para explicar pasos o servicio.",
        "prompt_instruction": "Z-path process composition with directional anchors and protected headline lane.",
        "thumbnail_family": "process",
        "id_tokens": ["process", "timeline", "pasos"],
        "basic_friendly": True,
        "structural_lines": [
            "Traza un recorrido en Z con nodos de lectura claramente numerables.",
            "Reserva cabecera limpia para titular y subtitulo breve.",
            "Alinea bloques de contenido a la ruta y mantiene separacion entre nodos.",
            "Evita ornamentacion sobre flechas o conectores para no romper flujo.",
            "Mantiene logo principal en la base del recorrido con baja interferencia.",
        ],
    },
    "stacked_cards": {
        "id_token": "stacked-cards",
        "name": "Tarjetas Apiladas",
        "description": "Capas editoriales con profundidad y orden de lectura.",
        "prompt_instruction": "Layered card composition with clear depth hierarchy and protected caption zone.",
        "thumbnail_family": "card",
        "id_tokens": ["card", "frame", "tarjeta"],
        "basic_friendly": True,
        "structural_lines": [
            "Construye capas de tarjetas con offsets suaves y jerarquia de profundidad.",
            "Protege una zona de caption sin solapamientos.",
            "Usa una tarjeta dominante para mensaje principal y secundarias para apoyo.",
            "Mantiene bordes y sombras consistentes para ordenar lectura.",
            "Ancla logo principal en pie de la composicion con firma discreta.",
        ],
    },
    "diagonal_energy": {
        "id_token": "diagonal-energy",
        "name": "Diagonal Dinamica",
        "description": "Eje diagonal de tension controlada para campañas activas.",
        "prompt_instruction": "Diagonal momentum composition with protected counter-balance text lane.",
        "thumbnail_family": "split",
        "id_tokens": ["diagonal", "versus", "split"],
        "basic_friendly": False,
        "structural_lines": [
            "Define un eje diagonal dominante para direccionar la atencion.",
            "Reserva una zona compensada de texto en el lado opuesto al empuje visual.",
            "Coloca un punto de tension principal y apoyos de menor escala en el recorrido.",
            "Evita que elementos decorativos crucen la zona de texto.",
            "Mantiene marca principal en extremo de salida con presencia secundaria.",
        ],
    },
    "timeline_vertical": {
        "id_token": "timeline-vertical",
        "name": "Linea Vertical",
        "description": "Cadena temporal limpia para hitos o anuncios.",
        "prompt_instruction": "Vertical timeline composition with ordered milestones and protected side text block.",
        "thumbnail_family": "process",
        "id_tokens": ["timeline", "process", "list"],
        "basic_friendly": True,
        "structural_lines": [
            "Construye una linea vertical de hitos con ritmo constante.",
            "Reserva una columna lateral para texto continuo y encabezado.",
            "Asigna un nodo principal y subnodos con tamano decreciente.",
            "Evita cruces de conectores y ruido entre hitos.",
            "Ancla logos fuera de la linea para no romper continuidad.",
        ],
    },
    "checklist_blocks": {
        "id_token": "checklist-blocks",
        "name": "Checklist Modular",
        "description": "Bloques funcionales para listas y validaciones.",
        "prompt_instruction": "Checklist-oriented block composition with strong scanning rhythm and safe text header.",
        "thumbnail_family": "list",
        "id_tokens": ["list", "check", "memo"],
        "basic_friendly": True,
        "structural_lines": [
            "Organiza bloques en lectura rapida con puntos de verificacion visibles.",
            "Reserva cabecera limpia para claim principal.",
            "Agrupa elementos por prioridad usando tamano y espaciado, no color extremo.",
            "Mantiene separacion consistente entre items para escaneo instantaneo.",
            "Ubica logo principal en pie con contraste moderado.",
        ],
    },
    "before_after": {
        "id_token": "before-after",
        "name": "Antes y Despues",
        "description": "Comparativa binaria con frontera clara.",
        "prompt_instruction": "Before/after comparison composition with explicit divide and protected title lane.",
        "thumbnail_family": "split",
        "id_tokens": ["comparison", "versus", "split"],
        "basic_friendly": True,
        "structural_lines": [
            "Divide la escena en dos estados comparables con frontera inequvoca.",
            "Reserva una banda de titulo fuera del eje de comparacion.",
            "Mantiene correspondencia de escala entre ambos lados.",
            "Evita overlays que oculten la frontera conceptual.",
            "Logo principal en base centrada o esquina inferior estable.",
        ],
    },
    "hub_spoke": {
        "id_token": "hub-spoke",
        "name": "Nucleo y Ramificaciones",
        "description": "Centro semantico con satelites explicativos.",
        "prompt_instruction": "Hub-and-spoke composition with central concept and distributed support nodes.",
        "thumbnail_family": "radial",
        "id_tokens": ["radial", "process", "ecosystem"],
        "basic_friendly": False,
        "structural_lines": [
            "Coloca un nucleo conceptual dominante y satelites de apoyo alrededor.",
            "Reserva texto principal en area protegida fuera del circulo de satelites.",
            "Conecta satelites con trazos minimos para mantener claridad.",
            "Define prioridad de lectura del centro hacia periferia.",
            "Ancla marca en base y evita logos dentro de conexiones.",
        ],
    },
}

INTENT_ARCHETYPES: dict[str, list[str]] = {
    "servicio": ["split_hero", "grid_bento", "process_z", "hub_spoke", "checklist_blocks"],
    "oferta": ["radial_spotlight", "split_hero", "stacked_cards", "diagonal_energy"],
    "comunicado": ["stacked_cards", "timeline_vertical", "checklist_blocks", "split_hero"],
    "pasos": ["process_z", "timeline_vertical", "checklist_blocks", "diagonal_energy"],
    "catalogo": ["grid_bento", "stacked_cards", "split_hero", "before_after"],
    "comparativa": ["before_after", "split_hero", "diagonal_energy", "checklist_blocks"],
    "dato": ["checklist_blocks", "timeline_vertical", "grid_bento", "hub_spoke"],
}

DENSITY_LINES = {
    "low": "Mucho aire entre bloques y apoyo muy ligero, por ejemplo un solo nivel de apoyo.",
    "mid": "Equilibrio entre aire y densidad con apoyos claros, por ejemplo dos niveles de apoyo.",
    "high": "Mayor densidad informativa con bloques compactos pero legibles, por ejemplo tres niveles de apoyo.",
}

TONE_LINES = {
    "editorial": "Ritmo editorial sereno y jerarquia clara, con lectura pausada.",
    "comercial": "Foco en conversion con lectura directa y CTA respirable, sin saturar.",
    "institucional": "Formalidad sobria y orden estable de lectura, sin efectos excesivos.",
    "didactico": "Progresion pedagogica y anclas visuales explicativas, con ejemplos discretos.",
    "dinamico": "Sensacion de movimiento sin perder claridad textual, con ritmo activo.",
}


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")


def read_json(path: Path) -> Any:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def load_existing_ids(project_root: Path) -> set[str]:
    ids: set[str] = set()

    index_path = project_root / "docs" / "legacy-compositions" / "commit-06e173f" / "ids-index.tsv"
    if index_path.exists():
        for raw in index_path.read_text(encoding="utf-8", errors="ignore").splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            first = line.split("\t", 1)[0].strip()
            if first and re.fullmatch(r"[a-z0-9][a-z0-9\-]*", first):
                ids.add(first)

    for rel in [
        ("src", "data", "legacy-promoted-layouts.json"),
        ("src", "data", "legacy-basic-layouts.json"),
        ("src", "data", "legacy-custom-layouts.json"),
    ]:
        data = read_json(project_root.joinpath(*rel))
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and isinstance(item.get("id"), str):
                    ids.add(item["id"].strip())

    overrides = read_json(project_root / "src" / "data" / "legacy-layout-overrides.json")
    if isinstance(overrides, dict):
        for key in overrides.keys():
            if isinstance(key, str) and key.strip():
                ids.add(key.strip())

    return ids


def unique_id(base_id: str, existing_ids: set[str]) -> str:
    candidate = base_id
    n = 2
    while candidate in existing_ids:
        candidate = f"{base_id}-v{n}"
        n += 1
    existing_ids.add(candidate)
    return candidate


def build_structural_prompt(archetype_key: str, density: str, tone: str, goal: str) -> str:
    arch = ARCHETYPES[archetype_key]
    goal_line = goal.strip() or "comunicar con claridad"
    title = arch["name"]

    estructura = [
        f"Composicion guiada por {title.lower()} con foco en {goal_line}.",
        "Deja margen para que el modelo improvise la escena mientras respeta la jerarquia general.",
    ]

    jerarquia = [
        "Elemento principal claro, con apoyos que no compiten.",
        "Segundo nivel con informacion de contexto, por ejemplo sello, dato breve o apoyo funcional.",
        "Detalle final que refuerza el mensaje sin saturar, por ejemplo un gesto o icono secundario.",
    ]

    distribucion = [
        "Bloques grandes y limpios con espacios respirables.",
        "Ritmo visual estable que facilite el escaneo, con alineaciones consistentes.",
        "Zona de texto protegida sin elementos invasivos, con margen de seguridad.",
    ]

    evitar = "Evitar ruido visual, superposiciones agresivas y microdetalles."

    return "\n".join([
        f"## Composición: {title}",
        f"**Estructura:** {estructura[0]} {estructura[1]}",
        "",
        "### Jerarquía Visual",
        f"1. {jerarquia[0]}",
        f"2. {jerarquia[1]}",
        f"3. {jerarquia[2]}",
        "",
        "### Distribución",
        f"- {distribucion[0]}",
        f"- {distribucion[1]}",
        f"- {distribucion[2]}",
        "- Logo principal en esquina inferior con peso secundario.",
        "",
        "### Evitar",
        evitar,
    ])


def pick_archetypes(intent: str, count: int, rng: random.Random) -> list[str]:
    base = list(INTENT_ARCHETYPES.get(intent, ARCHETYPES.keys()))
    if not base:
        base = list(ARCHETYPES.keys())

    rng.shuffle(base)
    if count <= len(base):
        return base[:count]

    picked = list(base)
    while len(picked) < count:
        picked.append(rng.choice(base))
    return picked


def build_variant(intent: str, goal: str, density: str, tone: str, archetype_key: str, existing_ids: set[str]) -> dict[str, Any]:
    arch = ARCHETYPES[archetype_key]
    base_id = slugify(f"{intent}-{arch['id_token']}")
    layout_id = unique_id(base_id, existing_ids)

    text_zone = TEXT_ZONE_BY_ARCHETYPE[archetype_key]
    mode_basic = bool(arch["basic_friendly"] and density in {"low", "mid"})

    return {
        "id": layout_id,
        "name": f"{arch['name']} ({intent})",
        "description": arch["description"],
        "svgIcon": "Layout",
        "textZone": text_zone,
        "promptInstruction": arch["prompt_instruction"],
        "structuralPrompt": build_structural_prompt(archetype_key, density, tone, goal),
        "skillVersion": SKILL_VERSION,
        "modeBasic": mode_basic,
        "modeAdvanced": True,
        "thumbnailSpec": {
            "family": arch["thumbnail_family"],
            "idTokens": arch["id_tokens"],
            "focus": f"{arch['thumbnail_family']} composition tuned for {intent}",
            "layoutThumbnailHint": "Ensure the ID keeps at least one suggested token to trigger a coherent thumbnail family.",
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate legacy composition variants compatible with admin panel.")
    parser.add_argument("--intent", required=True, choices=VALID_INTENTS)
    parser.add_argument("--goal", required=True)
    parser.add_argument("--count", type=int, default=3)
    parser.add_argument("--text-density", choices=["low", "mid", "high"], default="mid")
    parser.add_argument("--tone", choices=["editorial", "comercial", "institucional", "didactico", "dinamico"], default="editorial")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--project-root", default=".")
    parser.add_argument("--out", default="")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    count = max(1, min(12, args.count))

    rng = random.Random(args.seed)
    project_root = Path(args.project_root).resolve()
    existing_ids = load_existing_ids(project_root)

    archetype_keys = pick_archetypes(args.intent, count, rng)
    variants = [
        build_variant(
            intent=args.intent,
            goal=args.goal,
            density=args.text_density,
            tone=args.tone,
            archetype_key=key,
            existing_ids=existing_ids,
        )
        for key in archetype_keys
    ]

    payload = {
        "intent": args.intent,
        "goal": args.goal,
        "textDensity": args.text_density,
        "tone": args.tone,
        "count": len(variants),
        "variants": variants,
    }

    text = json.dumps(payload, ensure_ascii=False, indent=2)
    print(text)

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(text + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
