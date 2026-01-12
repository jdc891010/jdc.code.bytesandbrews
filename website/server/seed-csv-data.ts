import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'fs';
import { tribes, professions, talkingPoints } from '../shared/schema.js';

const sqlite = new Database('./database.sqlite');
const db = drizzle(sqlite);

function parseCSV(content: string) {
    // Normalize line endings and handle potential BOM
    const cleanContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    const lines = cleanContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
            } else if (line[i] === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += line[i];
            }
        }
        values.push(current.trim());

        const obj: any = {};
        headers.forEach((header, i) => {
            let val = values[i] || '';
            // Remove surrounding quotes if they exist
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1);
            }
            obj[header] = val;
        });
        return obj;
    });
}

async function seed() {
    console.log('🌱 Seeding CSV data...');

    try {
        // 1. Seed Tribes
        console.log('Seeding Tribes...');
        const tribesPath = '../database/mock_tribes.csv';
        if (fs.existsSync(tribesPath)) {
            const tribesCsv = fs.readFileSync(tribesPath, 'utf-8');
            const tribesData = parseCSV(tribesCsv);

            // Clear existing tribes
            await db.delete(tribes);

            for (const tribe of tribesData) {
                if (!tribe.id || !tribe.name) continue;
                await db.insert(tribes).values({
                    id: parseInt(tribe.id),
                    name: tribe.name,
                    description: tribe.description
                });
            }
            console.log(`✅ Seeded ${tribesData.length} tribes`);
        }

        // 2. Seed Professions
        console.log('Seeding Professions...');
        const professionsPath = '../src/talking_points/remote_work_professions.csv';
        const insertedProfessions: any[] = [];
        if (fs.existsSync(professionsPath)) {
            const professionsCsv = fs.readFileSync(professionsPath, 'utf-8');
            const professionsData = parseCSV(professionsCsv);

            await db.delete(professions);

            for (const prof of professionsData) {
                if (!prof.main_group || !prof.secondary_label) continue;
                const result = await db.insert(professions).values({
                    mainGroup: prof.main_group,
                    secondaryLabel: prof.secondary_label,
                    funLabel: prof.fun_labels || ''
                }).returning();
                insertedProfessions.push(result[0]);
            }
            console.log(`✅ Seeded ${insertedProfessions.length} professions`);
        }

        // 3. Seed Talking Points
        console.log('Seeding Talking Points...');
        const talkingPointsPath = '../src/talking_points/tech_it_talking_points.csv';
        if (fs.existsSync(talkingPointsPath)) {
            const talkingPointsCsv = fs.readFileSync(talkingPointsPath, 'utf-8');
            const talkingPointsData = parseCSV(talkingPointsCsv);

            await db.delete(talkingPoints);

            let seededTpCount = 0;
            for (const tp of talkingPointsData) {
                if (!tp.id || !tp.secondary_profession) continue;
                // Find matching profession
                const prof = insertedProfessions.find(p => p.secondaryLabel === tp.secondary_profession);
                if (prof) {
                    await db.insert(talkingPoints).values({
                        id: tp.id,
                        professionId: prof.id,
                        tryThese: tp.try_these.toLowerCase() === 'true',
                        avoidThese: tp.avoid_these.toLowerCase() === 'true',
                        text: tp.text
                    });
                    seededTpCount++;
                }
            }
            console.log(`✅ Seeded ${seededTpCount} talking points`);
        }

        console.log('🎉 CSV data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

seed().then(() => {
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
}).finally(() => {
    sqlite.close();
});
