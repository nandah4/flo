const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    
    // We want to replace 'text-primary' with 'text-text-primary' ONLY WHERE it came from my previous 'text-black' replacement.
    // Fortunately, the original 'text-primary' occurrences in Home.tsx were strictly for the icons:
    // "text-primary text-xl", "text-primary text-lg md:text-xl", and hover/border text like "to-primary", "bg-primary! text-black".
    // Wait, in my previous replacement I changed "hover:bg-primary! text-black" to "hover:bg-primary! text-primary".
    
    // First, let's replace all `text-secondary` with `text-text-secondary`. BUT avoid `text-secondary-app` and `text-secondary!` if it shouldn't be touched.
    // Actually, user said: "text yang menggunakan warna secondary -> ubah ke text-secondary". And then clarified "text-text-secondary".
    // So:
    content = content.replace(/\btext-secondary\b/g, 'text-text-secondary');
    content = content.replace(/\btext-secondary!/g, 'text-text-secondary!');
    
    // For text-primary (that was originally text-black), let's replace it with text-text-primary.
    // I know from grep that they are: 
    // "font-medium text-primary", "text-center text-primary", "border-gray-200! text-primary", "hover:bg-primary! text-primary",
    // "text-lg! font-semibold! text-primary!", "font-semibold text-primary"
    
    content = content.replace(/font-medium text-primary/g, 'font-medium text-text-primary');
    content = content.replace(/text-center text-primary/g, 'text-center text-text-primary');
    content = content.replace(/bg-primary! text-primary/g, 'bg-primary! text-text-primary');
    content = content.replace(/border-gray-200! text-primary/g, 'border-gray-200! text-text-primary');
    content = content.replace(/text-primary text-4xl!/g, 'text-text-primary text-4xl!');
    content = content.replace(/font-semibold text-primary/g, 'font-semibold text-text-primary');
    content = content.replace(/font-semibold! text-primary!/g, 'font-semibold! text-text-primary!');
    
    // In Header.tsx:
    content = content.replace(/font-medium text-primary/g, 'font-medium text-text-primary'); // Logo
    
    // In Footer.tsx:
    content = content.replace(/text-primary! hover:shadow-md/g, 'text-text-primary! hover:shadow-md'); // Social icons
    
    // Also "text-text-primary mb-2" (done via font-semibold text-primary above)
    // Are there any text-black left?
    content = content.replace(/\btext-black\b/g, 'text-text-primary');
    content = content.replace(/\btext-black!/g, 'text-text-primary!');
    
    // User already partially fixed text-primary to text-text-primary in Footer!
    // We already match font-semibold text-text-primary so that is fine (wont match font-semibold text-primary since it's already text-text-primary)

    fs.writeFileSync(path, content);
}

processFile('src/Home.tsx');
processFile('src/ui/Header.tsx');
processFile('src/ui/Footer.tsx');
processFile('src/ui/Layout.tsx');

console.log("Done");
