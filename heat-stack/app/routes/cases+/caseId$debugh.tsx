import { requireUserId } from "#app/utils/auth.server.ts";
import { getCaseForEditing, getLoggedInUserFromRequest } from "#app/utils/db/case.server.ts";
import { hasAdminRole } from "#app/utils/user.ts";
import { invariantResponse } from "@epic-web/invariant";
import { json } from "@remix-run/node";

export async function loader({ params, request }) {
  const userId = await requireUserId(request);
  const caseId = parseInt(params.caseId);
  const user = await getLoggedInUserFromRequest(request);
  const isAdmin = hasAdminRole(user);

  invariantResponse(!isNaN(caseId), "Invalid case ID", { status: 400 });

  const caseRecord = await getCaseForEditing(caseId, userId, isAdmin);
  invariantResponse(caseRecord, "Case not found", { status: 404 });

  const analysis = caseRecord.analysis?.[0];
  invariantResponse(analysis, "Invalid analysis detected", { status: 500 });

  const heatingInput = analysis.heatingInput?.[0];
  invariantResponse(heatingInput, "Invalid heating input detected", { status: 500 });

  const heatingSystemEfficiency = heatingInput.heatingSystemEfficiency;

  return json({ heatingSystemEfficiency });
}
