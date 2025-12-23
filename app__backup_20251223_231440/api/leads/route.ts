import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "leads.json");

type Lead = {
  id: string;
  createdAt: string;
  answers: any;
  userAgent?: string;
  ip?: string | null;
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, JSON.stringify([]), "utf-8");
}

function readLeads(): Lead[] {
  ensureFile();
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeLeads(leads: Lead[]) {
  ensureFile();
  fs.writeFileSync(FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

function isAuthorized(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  // Şifre tanımlı değilse güvenlik için KAPALI
  if (!adminPassword) return false;

  const token = req.headers.get("x-admin-token") || "";
  return token === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = readLeads().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  // POST herkese açık: müşteri dolduracak.
  // (İstersen burada da captcha/limit ekleriz.)
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const leads = readLeads();

  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    answers: body.answers ?? body,
    userAgent: req.headers.get("user-agent") ?? undefined,
    ip: req.headers.get("x-forwarded-for"),
  };

  leads.push(lead);
  writeLeads(leads);

  return NextResponse.json({ ok: true, id: lead.id });
}
