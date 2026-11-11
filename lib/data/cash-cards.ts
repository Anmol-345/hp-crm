import { mockCashCards } from "./mock-data";
import { CashCard, PositionLabel } from "./types";
import { getSupabase } from "@/lib/supabase/db";

const positionDbToLabel: Record<string, { pos: "I" | "II" | "III"; label: PositionLabel }> = {
  winner: { pos: "I", label: "Winner" },
  runner_up: { pos: "II", label: "Runner-up" },
  first_runner_up: { pos: "III", label: "1st Runner-up" },
};

function dataUrlToBlob(dataUrl: string): { blob: Blob; contentType: string } {
  const [header, base64Data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binaryStr = atob(base64Data);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return { blob: new Blob([bytes], { type: mime }), contentType: mime };
}

export async function getCashCards(): Promise<CashCard[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("cash_cards")
      .select(`
        id,
        serial_no,
        event_no,
        position,
        amount_inr,
        signed,
        signed_at,
        signature_path,
        remark,
        events (
          name,
          category
        ),
        athletes (
          full_name,
          bib_no,
          units (name)
        )
      `)
      .order("serial_no", { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockCashCards];
    }

    // Resolve signed URLs only for cards that actually have a signature path
    const signedPathCache = new Map<string, string>();
    const pathsToSign = [...new Set(data.map((r: any) => r.signature_path).filter(Boolean))];

    if (pathsToSign.length > 0) {
      await Promise.all(
        pathsToSign.map(async (path) => {
          try {
            const { data: signedData } = await supabase.storage
              .from("signatures")
              .createSignedUrl(path, 3600);
            if (signedData?.signedUrl) {
              signedPathCache.set(path, signedData.signedUrl);
            }
          } catch {
            // ignore individual failures
          }
        })
      );
    }

    return data.map((row: any) => {
      const pInfo = positionDbToLabel[row.position] || { pos: "I", label: "Winner" };
      const signatureUrl = row.signature_path
        ? signedPathCache.get(row.signature_path)
        : undefined;
      const bib = row.athletes?.bib_no ? String(row.athletes.bib_no) : "—";
      const isSigned = Boolean(row.signed);

      return {
        serialNo: row.serial_no,
        eventNo: row.event_no ?? 0,
        eventName: row.events?.name || `Event ${row.event_no}`,
        category: row.events?.category || "Open",
        position: pInfo.pos,
        positionLabel: pInfo.label,
        bib,
        athleteName: row.athletes?.full_name || "Official Athlete",
        unit: row.athletes?.units?.name || "HPCL",
        prizeAmount: row.amount_inr,
        status: isSigned ? ("Signed" as const) : ("Pending" as const),
        dateSigned: row.signed_at ? row.signed_at.split("T")[0] : undefined,
        signatureDataUrl: signatureUrl,
        notes: row.remark || undefined,
      };
    });
  } catch {
    return [...mockCashCards];
  }
}

export async function getCashCardsByEvent(eventNo: number): Promise<CashCard[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("cash_cards")
      .select(`
        id,
        serial_no,
        event_no,
        position,
        amount_inr,
        signed,
        signed_at,
        signature_path,
        remark,
        events (
          name,
          category
        ),
        athletes (
          full_name,
          bib_no,
          units (name)
        )
      `)
      .eq("event_no", eventNo)
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) {
      return mockCashCards.filter((c) => c.eventNo === eventNo);
    }

    return data.map((row: any) => {
      const pInfo = positionDbToLabel[row.position] || { pos: "I", label: "Winner" };
      const bib = row.athletes?.bib_no ? String(row.athletes.bib_no) : "—";
      const isSigned = Boolean(row.signed);

      return {
        serialNo: row.serial_no,
        eventNo: row.event_no ?? eventNo,
        eventName: row.events?.name || `Event ${row.event_no}`,
        category: row.events?.category || "Open",
        position: pInfo.pos,
        positionLabel: pInfo.label,
        bib,
        athleteName: row.athletes?.full_name || "Official Athlete",
        unit: row.athletes?.units?.name || "HPCL",
        prizeAmount: row.amount_inr,
        status: isSigned ? ("Signed" as const) : ("Pending" as const),
        dateSigned: row.signed_at ? row.signed_at.split("T")[0] : undefined,
        signatureDataUrl: undefined,
        notes: row.remark || undefined,
      };
    });
  } catch {
    return mockCashCards.filter((c) => c.eventNo === eventNo);
  }
}

export async function updateCashCardStatus(
  serialNo: number,
  status: "Signed" | "Pending",
  signatureDataUrl?: string
): Promise<CashCard | null> {
  try {
    const supabase = await getSupabase();

    let signaturePath: string | null = null;
    let signedUrl: string | undefined = undefined;

    if (status === "Signed" && signatureDataUrl) {
      try {
        const filePath = `card_${serialNo}_${Date.now()}.png`;
        const { blob, contentType } = dataUrlToBlob(signatureDataUrl);

        const { error: uploadError } = await supabase.storage
          .from("signatures")
          .upload(filePath, blob, {
            contentType,
            upsert: true,
          });

        if (!uploadError) {
          signaturePath = filePath;
          const { data: signedRes } = await supabase.storage
            .from("signatures")
            .createSignedUrl(filePath, 3600);
          signedUrl = signedRes?.signedUrl || signatureDataUrl;
        } else {
          // If storage upload fails (e.g. bucket policy or offline), keep the data url in client
          signedUrl = signatureDataUrl;
        }
      } catch {
        signedUrl = signatureDataUrl;
      }
    }

    const isSigned = status === "Signed";
    const nowIso = isSigned ? new Date().toISOString() : null;

    const { data: updatedRow, error: updateError } = await supabase
      .from("cash_cards")
      .update({
        signed: isSigned,
        signed_at: nowIso,
        signature_path: isSigned ? signaturePath : null,
      })
      .eq("serial_no", serialNo)
      .select(`
        id,
        serial_no,
        event_no,
        position,
        amount_inr,
        signed,
        signed_at,
        signature_path,
        remark,
        events (
          name,
          category
        ),
        athletes (
          full_name,
          bib_no,
          units (name)
        )
      `)
      .single();

    if (updateError || !updatedRow) {
      // Return updated mock fallback
      const mockIndex = mockCashCards.findIndex((c) => c.serialNo === serialNo);
      if (mockIndex !== -1) {
        mockCashCards[mockIndex] = {
          ...mockCashCards[mockIndex],
          status,
          dateSigned: isSigned ? new Date().toISOString().split("T")[0] : undefined,
          signatureDataUrl: signedUrl || signatureDataUrl,
        };
        return { ...mockCashCards[mockIndex] };
      }
      return null;
    }

    const row: any = updatedRow;
    const pInfo = positionDbToLabel[row.position] || { pos: "I", label: "Winner" };

    return {
      serialNo: row.serial_no,
      eventNo: row.event_no ?? 0,
      eventName: row.events?.name || `Event ${row.event_no}`,
      category: row.events?.category || "Open",
      position: pInfo.pos,
      positionLabel: pInfo.label,
      bib: row.athletes?.bib_no ? String(row.athletes.bib_no) : "—",
      athleteName: row.athletes?.full_name || "Official Athlete",
      unit: row.athletes?.units?.name || "HPCL",
      prizeAmount: row.amount_inr,
      status: Boolean(row.signed) ? "Signed" : "Pending",
      dateSigned: row.signed_at ? row.signed_at.split("T")[0] : undefined,
      signatureDataUrl: signedUrl,
      notes: row.remark || undefined,
    };
  } catch {
    const mockIndex = mockCashCards.findIndex((c) => c.serialNo === serialNo);
    if (mockIndex !== -1) {
      mockCashCards[mockIndex] = {
        ...mockCashCards[mockIndex],
        status,
        dateSigned: status === "Signed" ? new Date().toISOString().split("T")[0] : undefined,
        signatureDataUrl,
      };
      return { ...mockCashCards[mockIndex] };
    }
    return null;
  }
}

export async function getCashCardSummary(): Promise<{
  total: number;
  signed: number;
  pending: number;
  totalAmount: number;
  disbursed: number;
}> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("cash_cards")
      .select("amount_inr, signed");

    if (error || !data || data.length === 0) {
      const total = mockCashCards.length;
      const signed = mockCashCards.filter((c) => c.status === "Signed").length;
      const pending = total - signed;
      const totalAmount = mockCashCards.reduce((sum, c) => sum + c.prizeAmount, 0);
      const disbursed = mockCashCards
        .filter((c) => c.status === "Signed")
        .reduce((sum, c) => sum + c.prizeAmount, 0);
      return { total, signed, pending, totalAmount, disbursed };
    }

    const total = data.length;
    const signed = data.filter((c: any) => Boolean(c.signed)).length;
    const pending = total - signed;
    const totalAmount = data.reduce((sum: number, c: any) => sum + (c.amount_inr || 0), 0);
    const disbursed = data
      .filter((c: any) => Boolean(c.signed))
      .reduce((sum: number, c: any) => sum + (c.amount_inr || 0), 0);

    return { total, signed, pending, totalAmount, disbursed };
  } catch {
    const total = mockCashCards.length;
    const signed = mockCashCards.filter((c) => c.status === "Signed").length;
    const pending = total - signed;
    const totalAmount = mockCashCards.reduce((sum, c) => sum + c.prizeAmount, 0);
    const disbursed = mockCashCards
      .filter((c) => c.status === "Signed")
      .reduce((sum, c) => sum + c.prizeAmount, 0);
    return { total, signed, pending, totalAmount, disbursed };
  }
}
