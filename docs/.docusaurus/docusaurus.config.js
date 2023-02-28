/*
AUTOGENERATED - DON'T EDIT
Your edits in this file will be overwritten in the next build!
Modify the docusaurus.config.js file at your site's root instead.
*/
export default {
  "title": "Empiric Network",
  "tagline": "Documentation and Guides",
  "url": "https://docs.empiric.network/",
  "baseUrl": "/",
  "onBrokenLinks": "warn",
  "onBrokenMarkdownLinks": "ignore",
  "favicon": "img/favicon.png",
  "organizationName": "Astraly-Labs",
  "projectName": "Empiric",
  "trailingSlash": false,
  "themeConfig": {
    "image": "img/twitter_card_bg.jpeg",
    "prism": {
      "additionalLanguages": [
        "solidity"
      ]
    },
    "algolia": {
      "apiKey": "10bd5a4750327624845152ae40c0c9c0",
      "indexName": "v3-docs",
      "appId": "I2FJIAZ9PU",
      "contextualSearch": true,
      "searchParameters": {},
      "searchPagePath": "search"
    },
    "navbar": {
      "title": "Empiric Docs",
      "logo": {
        "alt": "Empiric Logo",
        "src": "img/emp_dark_icon.svg"
      },
      "items": [
        {
          "to": "/docs/introduction",
          "label": "Protocol",
          "position": "right",
          "className": "persistent"
        },
        {
          "label": "Feedbacks",
          "to": "https://forms.gle/KvLdKnLprrER3VyM6",
          "position": "right",
          "className": "persistent"
        },
        {
          "href": "https://github.com/Astraly-Labs",
          "label": "GitHub",
          "position": "right",
          "className": "persistent"
        }
      ],
      "hideOnScroll": false
    },
    "colorMode": {
      "defaultMode": "dark",
      "disableSwitch": false,
      "respectPrefersColorScheme": true
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadata": [],
    "hideableSidebar": false,
    "autoCollapseSidebarCategories": false,
    "tableOfContents": {
      "minHeadingLevel": 2,
      "maxHeadingLevel": 3
    }
  },
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "path": "docs",
          "remarkPlugins": [
            null
          ],
          "rehypePlugins": [
            null
          ],
          "routeBasePath": "/docs",
          "sidebarPath": "/Users/matteogeorges/Documents/GitHub/docs/Empiric/docs/sidebars.js",
          "includeCurrentVersion": false,
          "versions": {
            "V1": {
              "banner": "none"
            }
          }
        },
        "blog": {
          "remarkPlugins": [
            null
          ],
          "rehypePlugins": [
            null
          ],
          "path": "blog/",
          "blogTitle": "Engineering Blog",
          "blogSidebarCount": 0
        },
        "googleAnalytics": {
          "trackingID": "UA-128182339-7",
          "anonymizeIP": true
        },
        "theme": {
          "customCss": "/Users/matteogeorges/Documents/GitHub/docs/Empiric/docs/src/css/custom.css",
          "customCss2": "/Users/matteogeorges/Documents/GitHub/docs/Empiric/docs/src/css/colors.css"
        }
      }
    ]
  ],
  "stylesheets": [
    {
      "href": "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      "type": "text/css",
      "integrity": "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      "crossorigin": "anonymous"
    }
  ],
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "onDuplicateRoutes": "warn",
  "staticDirectories": [
    "static"
  ],
  "customFields": {},
  "plugins": [],
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};