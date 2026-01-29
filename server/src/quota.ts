import fs from "node:fs/promises";

type Args = {
    month: number;   // 1..12
    areaHa: number;  // hectare
    kc: number;
    sf: number;
    penPath: string;
    cliPath: string;
};

export async function calcMonthlyQuota(args: Args) {
    const { month, areaHa, kc, sf, penPath, cliPath } = args;

    // format KONYA.pen / KONYA.cli
    const penText = await fs.readFile(penPath, "utf-8");
    const cliText = await fs.readFile(cliPath, "utf-8");

    return {
        ok: true,
        month,
        areaHa,
        kc,
        sf,
        penChars: penText.length,
        cliChars: cliText.length,
    };
}
