#!/usr/bin/env node

// ENV Var Confessional - Where your environment variables come to confess their sins
// Usage: node env-confessional.js [.env.example]

const fs = require('fs');
const path = require('path');

// The sacred text that reveals what should be
const exampleFile = process.argv[2] || '.env.example';

// Read the holy scripture (or fail trying)
try {
    const exampleContent = fs.readFileSync(exampleFile, 'utf8');
    const requiredVars = exampleContent
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => line.split('=')[0].trim());

    console.log(`\n📖 Reading from ${exampleFile} (${requiredVars.length} variables expected)`);
    console.log('='.repeat(50));

    let sins = 0;
    let confessions = 0;

    requiredVars.forEach(varName => {
        if (process.env[varName] === undefined) {
            console.log(`❌ ${varName}: MISSING - This variable is playing hide and seek (and winning)`);
            sins++;
        } else if (process.env[varName].trim() === '') {
            console.log(`⚠️  ${varName}: EMPTY - It showed up but brought nothing to the party`);
            sins++;
        } else {
            console.log(`✅ ${varName}: PRESENT - A rare moment of competence`);
            confessions++;
        }
    });

    console.log('='.repeat(50));
    console.log(`\n📊 CONFESSION RESULTS:`);
    console.log(`   ✅ Virtuous variables: ${confessions}`);
    console.log(`   ❌ Sinful variables: ${sins}`);
    
    if (sins === 0) {
        console.log('\n🎉 All variables accounted for! Your config is... acceptable.');
    } else {
        console.log(`\n💀 ${sins} variable(s) need to confess their sins and be set properly.`);
        console.log('   Your app will probably crash now. You were warned.');
        process.exit(1);
    }

} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(`\n🔥 ERROR: ${exampleFile} not found. Did you look under the couch?`);
        console.log('   Create a .env.example file or specify a different one.');
    } else {
        console.log(`\n💥 ERROR: ${error.message}`);
        console.log('   Even the error handler is confused.');
    }
    process.exit(1);
}
