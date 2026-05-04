$IMAGES = @(
    @{ id = "art_b4"; prompt = "A stack of heavy ancient gold coins, embossed with a forgotten emperor face, dark fantasy style, 1:1, isolated on black" },
    @{ id = "art_a3"; prompt = "A glowing fragment of the philosopher stone, crimson crystalline structure, high energy, dark fantasy style, 1:1, isolated on black" },
    @{ id = "art_a4"; prompt = "A meteor sword glowing with starlight, forged from space iron, celestial patterns, dark fantasy style, 1:1, isolated on black" },
    @{ id = "art_s3"; prompt = "A spectral orb containing a hero soul, ethereal blue light, heroic aura, dark fantasy style, 1:1, isolated on black" },
    @{ id = "art_s4"; prompt = "A shimmering golden thread of fate, floating and twisting in the air, divine light, dark fantasy style, 1:1, isolated on black" },
    @{ id = "dm1"; prompt = "A forbidden syringe filled with glowing purple medicine, dangerous aura, dark fantasy style, 1:1, isolated on black" },
    @{ id = "dm2"; prompt = "A forged gold medal of a high ranking official, slightly imperfect, tarnished, dark fantasy style, 1:1, isolated on black" },
    @{ id = "dm3"; prompt = "A sinister black book titled assassination manual, bloodstains, dagger bookmark, dark fantasy style, 1:1, isolated on black" },
    @{ id = "dungeon_d1"; prompt = "Dark damp cave entrance, goblin tracks, bones, dark fantasy style, 16:9" },
    @{ id = "dungeon_d2"; prompt = "Ancient forest shrouded in thick mysterious fog, twisted trees, dark fantasy style, 16:9" },
    @{ id = "dungeon_d3"; prompt = "Sunken stone ruins underground, vines, ancient statues, dark fantasy style, 16:9" },
    @{ id = "dungeon_d4"; prompt = "Spooky medieval graveyard at night, ornate stone tombs, ghostly mist, dark fantasy style, 16:9" },
    @{ id = "dungeon_d5"; prompt = "Volcanic cave with flowing lava, glowing red rocks, heat haze, dark fantasy style, 16:9" },
    @{ id = "dungeon_d6"; prompt = "Corridor made of glowing crystals, refracting light, mystical atmosphere, dark fantasy style, 16:9" },
    @{ id = "dungeon_d7"; prompt = "Stone pathway above the clouds, floating islands, bright sunlight, dark fantasy style, 16:9" },
    @{ id = "dungeon_d8"; prompt = "Deep dark chasm, glowing purple energy from the bottom, jagged rocks, dark fantasy style, 16:9" },
    @{ id = "dungeon_d9"; prompt = "Massive dragon nest made of bones and gold, dark cavern, scales on floor, dark fantasy style, 16:9" },
    @{ id = "dungeon_d10"; prompt = "Apocalyptic battlefield of gods, burning sky, giant skeletons, epic scale, dark fantasy style, 16:9" }
)

$outDir = "public/images"

foreach ($img in $IMAGES) {
    $path = "$outDir/$($img.id).webp"
    
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        if ($size -gt 2048) { continue }
        else { Remove-Item $path }
    }
    
    $width = if ($img.id -like "dungeon_*") { 800 } else { 512 }
    $height = if ($img.id -like "dungeon_*") { 450 } else { 512 }
    
    $encodedPrompt = [uri]::EscapeDataString($img.prompt)
    $seed = Get-Random -Maximum 1000000
    
    # Try WITHOUT model parameter to use default, which might have different limits
    $url = "https://image.pollinations.ai/prompt/$encodedPrompt`?width=$width&height=$height&nologo=true&seed=$seed"
    
    Write-Host "Fetching $($img.id)..."
    curl.exe -L -o "$path" "$url"
    
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        if ($size -lt 2048) {
            Write-Host "Throttled. Waiting 30s..."
            Remove-Item $path
            Start-Sleep -Seconds 30
        } else {
            Write-Host "Success!"
            Start-Sleep -Seconds 5
        }
    }
}
