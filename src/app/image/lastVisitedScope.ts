export function shouldApplyLastVisitedImageBrand(params: {
    targetBrandId: string | null
    requestedActiveBrandId: string | null
    currentActiveBrandId: string | null
    persistedActiveBrandId: string | null
}) {
    const {
        targetBrandId,
        requestedActiveBrandId,
        currentActiveBrandId,
        persistedActiveBrandId,
    } = params

    if (!targetBrandId) return false

    // The globally active brand always wins. Last-visited image scope is only a fallback
    // when the app still has no active brand resolved at all.
    if (requestedActiveBrandId || currentActiveBrandId || persistedActiveBrandId) return false

    return true
}
