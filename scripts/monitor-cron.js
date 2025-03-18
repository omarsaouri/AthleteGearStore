// A script to check if the deployed cron endpoints are working
// Usage: node scripts/monitor-cron.js https://your-admin-app.vercel.app https://your-store-app.vercel.app

const adminUrl = process.argv[2];
const storeUrl = process.argv[3];

if (!adminUrl) {
  console.error(
    "Error: Please provide at least the admin app URL as an argument",
  );
  console.log(
    "Usage: node scripts/monitor-cron.js https://admin-app.vercel.app [https://store-app.vercel.app]",
  );
  process.exit(1);
}

async function checkEndpoint(baseUrl) {
  try {
    const url = `${baseUrl}/api/cron/ping`;
    console.log(`Checking ${url}...`);

    const start = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - start;

    const data = await response.json();

    console.log(`Status: ${response.status} (${response.statusText})`);
    console.log(`Response Time: ${duration}ms`);
    console.log("Response Data:", data);

    return {
      url,
      success: response.status >= 200 && response.status < 300 && data.success,
      status: response.status,
      duration,
      data,
    };
  } catch (error) {
    console.error(`Error checking ${baseUrl}:`, error.message);
    return {
      url: `${baseUrl}/api/cron/ping`,
      success: false,
      error: error.message,
    };
  }
}

async function runChecks() {
  console.log("======= CRON JOB MONITORING =======");
  console.log(`Time: ${new Date().toISOString()}`);
  console.log("===================================");

  const adminResult = await checkEndpoint(adminUrl);
  console.log("===================================");

  if (storeUrl) {
    const storeResult = await checkEndpoint(storeUrl);
    console.log("===================================");

    console.log("SUMMARY:");
    console.log(
      `Admin Endpoint: ${adminResult.success ? "✅ WORKING" : "❌ FAILED"}`,
    );
    console.log(
      `Store Endpoint: ${storeResult.success ? "✅ WORKING" : "❌ FAILED"}`,
    );
  } else {
    console.log("SUMMARY:");
    console.log(
      `Admin Endpoint: ${adminResult.success ? "✅ WORKING" : "❌ FAILED"}`,
    );
  }
}

runChecks().catch((err) => {
  console.error("Monitor script failed:", err);
  process.exit(1);
});
