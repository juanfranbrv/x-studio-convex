export default {
    providers: [
        {
            domain: process.env.CLERK_ISSUER_URL?.trim()!,
            applicationID: "convex",
        },
    ],
};
