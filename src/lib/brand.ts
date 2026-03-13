export const brand = {
  name: "Postlaboratory",
  domain: "postlaboratory.com",
  appUrl:
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "") ||
    "https://postlaboratory.com",
  legacyDomains: {
    adstudioClick: "adstudio.click",
    wwwAdstudioClick: "www.adstudio.click",
    adstudioCom: "adstudio.com",
    wwwAdstudioCom: "www.adstudio.com",
  },
} as const;
