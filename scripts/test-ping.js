// Script to test the Supabase database ping
// Run with: node scripts/test-ping.js

async function testPing() {
  console.log("Testing database ping...");

  try {
    // Test admin ping
    console.log("Testing admin ping endpoint...");
    const adminResponse = await fetch("http://localhost:3000/api/cron/ping");
    const adminData = await adminResponse.json();

    console.log("Admin Ping Result:", adminData);
    console.log(
      `Admin Ping ${adminData.success ? "SUCCESSFUL" : "FAILED"} in ${adminData.duration || "N/A"}`,
    );

    // Test store ping (if running)
    try {
      console.log("\nTesting store ping endpoint...");
      const storeResponse = await fetch("http://localhost:3001/api/cron/ping");
      const storeData = await storeResponse.json();

      console.log("Store Ping Result:", storeData);
      console.log(
        `Store Ping ${storeData.success ? "SUCCESSFUL" : "FAILED"} in ${storeData.duration || "N/A"}`,
      );
    } catch (storeError) {
      console.log("Store app might not be running. Skipping store ping test.");
    }
  } catch (error) {
    console.error("Error testing ping endpoints:", error);
    console.log("Make sure your development servers are running.");
  }
}

testPing();
