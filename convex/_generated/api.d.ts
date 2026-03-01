/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as assets from "../assets.js";
import type * as brands from "../brands.js";
import type * as carousel from "../carousel.js";
import type * as carouselAdmin from "../carouselAdmin.js";
import type * as carouselSeed from "../carouselSeed.js";
import type * as economic from "../economic.js";
import type * as feedback from "../feedback.js";
import type * as generations from "../generations.js";
import type * as initPresets from "../initPresets.js";
import type * as layoutRatings from "../layoutRatings.js";
import type * as pipeline from "../pipeline.js";
import type * as presets from "../presets.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";
import type * as work_sessions from "../work_sessions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  assets: typeof assets;
  brands: typeof brands;
  carousel: typeof carousel;
  carouselAdmin: typeof carouselAdmin;
  carouselSeed: typeof carouselSeed;
  economic: typeof economic;
  feedback: typeof feedback;
  generations: typeof generations;
  initPresets: typeof initPresets;
  layoutRatings: typeof layoutRatings;
  pipeline: typeof pipeline;
  presets: typeof presets;
  settings: typeof settings;
  users: typeof users;
  work_sessions: typeof work_sessions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
