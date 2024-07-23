import {withSentryConfig} from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['utfs.io'],
    },
  };

export default withSentryConfig(withSentryConfig(withSentryConfig(nextConfig, {

org: "bihance",
project: "bihance",

silent: !process.env.CI,

widenClientFileUpload: true,

hideSourceMaps: true,
disableLogger: true,

automaticVercelMonitors: true,
}), {

org: "bihance",
project: "bihance",
silent: !process.env.CI,
widenClientFileUpload: true,

hideSourceMaps: true,
disableLogger: true,

automaticVercelMonitors: true,
}), {


org: "bihance",
project: "bihance",

silent: !process.env.CI,
widenClientFileUpload: true,

hideSourceMaps: true,
disableLogger: true,
automaticVercelMonitors: true,
});