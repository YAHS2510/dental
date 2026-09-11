import { encode } from "next-auth/jwt";

const secret =
  process.env.NEXTAUTH_SECRET ||
  "super-secret-clinic-auth-token-for-dev-session-key-32-chars-min";

const BASE_URL = "http://localhost:3000";

async function runRbacTests() {
  console.log("=================================================");
  console.log("  ROLE-BASED ACCESS CONTROL (RBAC) TEST SUITE   ");
  console.log("=================================================\n");

  // 1. Create a Staff JWT Token
  const staffToken = await encode({
    token: {
      id: "staff-2",
      name: "Dr. Sarah Chen, MD",
      email: "staff@healthsphere.example.com",
      role: "STAFF",
    },
    secret,
  });

  // 2. Create an Admin (Clinic Owner) JWT Token
  const adminToken = await encode({
    token: {
      id: "staff-1",
      name: "Dr. Evelyn Reed, MD",
      email: "admin@healthsphere.example.com",
      role: "ADMIN",
    },
    secret,
  });

  const ownerOnlyPaths = [
    "/admin/booking-form",
    "/admin/settings",
    "/admin/services",
    "/admin/staff",
    "/admin/email-previews",
    "/admin/analytics",
    "/admin/reviews",
  ];

  const operationalPaths = [
    "/admin",
    "/admin/pending",
    "/admin/calendar",
    "/admin/appointments",
    "/admin/whatsapp",
    "/admin/patients",
  ];

  console.log("[Test 1] Testing Staff User Access to Owner-Only Routes:");
  for (const path of ownerOnlyPaths) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Cookie: `next-auth.session-token=${staffToken}`,
      },
      redirect: "manual",
    });

    // Should redirect to /admin?error=admin_only (HTTP 307)
    const location = res.headers.get("location") || "";
    const isBlocked =
      res.status === 307 && location.includes("/admin?error=admin_only");
    if (isBlocked) {
      console.log(
        `  ✓ BLOCKED [STAFF] -> ${path.padEnd(25)} (Redirected to /admin?error=admin_only)`
      );
    } else {
      console.error(
        `  ✗ FAILED [STAFF] -> ${path} (Status: ${res.status}, Location: ${location})`
      );
      process.exit(1);
    }
  }

  console.log(
    "\n[Test 2] Testing Staff User Access to Daily Operational Routes:"
  );
  for (const path of operationalPaths) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Cookie: `next-auth.session-token=${staffToken}`,
      },
      redirect: "manual",
    });

    const isAllowed = res.status === 200;
    if (isAllowed) {
      console.log(`  ✓ ALLOWED [STAFF] -> ${path.padEnd(25)} (Status 200 OK)`);
    } else {
      console.error(`  ✗ FAILED [STAFF] -> ${path} (Status: ${res.status})`);
      process.exit(1);
    }
  }

  console.log(
    "\n[Test 3] Testing Clinic Owner (ADMIN) Access to Owner-Only Routes:"
  );
  for (const path of ownerOnlyPaths) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Cookie: `next-auth.session-token=${adminToken}`,
      },
      redirect: "manual",
    });

    const isAllowed = res.status === 200;
    if (isAllowed) {
      console.log(`  ✓ ALLOWED [ADMIN] -> ${path.padEnd(25)} (Status 200 OK)`);
    } else {
      console.error(`  ✗ FAILED [ADMIN] -> ${path} (Status: ${res.status})`);
      process.exit(1);
    }
  }

  console.log(
    "\n[Test 4] Testing Booking Form Config Modification API (/api/booking-form/config):"
  );
  // Staff attempt to PUT -> Should return 403 Forbidden
  const staffPutRes = await fetch(`${BASE_URL}/api/booking-form/config`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `next-auth.session-token=${staffToken}`,
    },
    body: JSON.stringify({
      treatments: [{ id: "unauthorized", title: "Hacked Service" }],
    }),
  });

  const staffPutData = await staffPutRes.json();
  if (staffPutRes.status === 403 && staffPutData.success === false) {
    console.log(
      `  ✓ FORBIDDEN [STAFF PUT] -> Rejected with HTTP 403: "${staffPutData.error}"`
    );
  } else {
    console.error(
      `  ✗ FAILED [STAFF PUT] -> Expected 403, got ${staffPutRes.status}`,
      staffPutData
    );
    process.exit(1);
  }

  // Admin attempt to GET & PUT -> Should return 200 OK
  const adminPutRes = await fetch(`${BASE_URL}/api/booking-form/config`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `next-auth.session-token=${adminToken}`,
    },
    body: JSON.stringify({
      action: "reset",
    }),
  });

  const adminPutData = await adminPutRes.json();
  if (adminPutRes.status === 200 && adminPutData.success === true) {
    console.log(
      `  ✓ PERMITTED [ADMIN PUT] -> Successfully accepted with HTTP 200`
    );
  } else {
    console.error(
      `  ✗ FAILED [ADMIN PUT] -> Expected 200, got ${adminPutRes.status}`,
      adminPutData
    );
    process.exit(1);
  }

  console.log(
    "\n[Test 5] Testing Clinic Branding & Logo API (/api/clinic/branding):"
  );
  // GET branding
  const getBrandRes = await fetch(`${BASE_URL}/api/clinic/branding`);
  const getBrandData = await getBrandRes.json();
  if (
    getBrandRes.status === 200 &&
    getBrandData.success &&
    getBrandData.branding?.logo
  ) {
    console.log(
      `  ✓ PERMITTED [PUBLIC GET] -> Fetched branding with logo type: "${getBrandData.branding.logo.type}"`
    );
  } else {
    console.error("  ✗ FAILED [GET BRANDING] ->", getBrandData);
    process.exit(1);
  }

  // Staff attempt to PUT branding -> Should return 403 Forbidden
  const staffBrandRes = await fetch(`${BASE_URL}/api/clinic/branding`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `next-auth.session-token=${staffToken}`,
    },
    body: JSON.stringify({
      logo: { type: "IMAGE", imageUrl: "https://evil.com/fake-logo.png" },
    }),
  });
  const staffBrandData = await staffBrandRes.json();
  if (staffBrandRes.status === 403 && staffBrandData.success === false) {
    console.log(
      `  ✓ FORBIDDEN [STAFF PUT] -> Rejected logo alteration with HTTP 403: "${staffBrandData.error}"`
    );
  } else {
    console.error(
      `  ✗ FAILED [STAFF PUT BRANDING] -> Expected 403, got ${staffBrandRes.status}`,
      staffBrandData
    );
    process.exit(1);
  }

  // Admin attempt to PUT branding -> Should return 200 OK
  const adminBrandRes = await fetch(`${BASE_URL}/api/clinic/branding`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `next-auth.session-token=${adminToken}`,
    },
    body: JSON.stringify({
      logo: {
        type: "ICON",
        iconName: "Smile",
        clinicDisplayName: "HealthSphere Clinic",
        tagline: "Dental & Family Care",
      },
    }),
  });
  const adminBrandData = await adminBrandRes.json();
  if (
    adminBrandRes.status === 200 &&
    adminBrandData.success &&
    adminBrandData.branding?.logo?.iconName === "Smile"
  ) {
    console.log(
      `  ✓ PERMITTED [ADMIN PUT] -> Successfully changed clinic logo to "Smile" (Dental Care)`
    );
  } else {
    console.error(
      `  ✗ FAILED [ADMIN PUT BRANDING] -> Expected 200 with Smile icon, got:`,
      adminBrandData
    );
    process.exit(1);
  }

  console.log("\n=================================================");
  console.log("  🎉 ALL 17 RBAC & BRANDING PERMISSION CHECKS PASSED (17/17) ");
  console.log("=================================================\n");
}

runRbacTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
