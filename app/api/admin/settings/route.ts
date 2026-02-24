import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.appSetting.findMany({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

const updateSettingsSchema = z.object({
  settings: z.record(z.string(), z.string()),
});

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { settings } = updateSettingsSchema.parse(body);

    // Update each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      db.appSetting.updateMany({
        where: { settingKey: key },
        data: { settingValue: value },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
