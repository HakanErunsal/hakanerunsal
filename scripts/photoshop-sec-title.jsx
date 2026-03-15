/*
 * Add two-line ad text at bottom-left with orange emphasis
 * 
 * File → Scripts → Browse → select this file
 * Requires: Inter Tight font (Bold weight) from Google Fonts
 */

(function () {
    if (!app.documents.length) { alert("Open an image first!"); return; }

    var doc = app.activeDocument;
    var W = doc.width.as("px");
    var H = doc.height.as("px");

    var origRuler = app.preferences.rulerUnits;
    var origType = app.preferences.typeUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.POINTS;

    // --- CONFIG ---
    var LINE1 = "INTELLIGENT";       // orange emphasis word
    var LINE2 = "ENEMY COMBAT";      // white
    var FONT = "InterTight-Bold";
    var FONT_FALLBACK = "Inter-Bold";
    var FONT_SIZE = 180;             // pt (4K)
    var TRACKING = -20;
    var ORANGE = [208, 124, 38];     // #d07c26
    var WHITE = [255, 255, 255];

    var MARGIN_LEFT = 160;           // px from left edge (4K)
    var MARGIN_BOTTOM = 140;         // px from bottom edge (4K)
    var LINE_GAP = 30;               // extra px between lines (4K)

    // Fade band at bottom
    var FADE_HEIGHT = 700;           // px from bottom (4K)
    var FADE_OPACITY = 22;           // subtle fade
    // --------------

    var black = new SolidColor();
    black.rgb.red = 0; black.rgb.green = 0; black.rgb.blue = 0;
    app.foregroundColor = black;

    // Subtle bottom fade only
    var fadeLayer = doc.artLayers.add();
    fadeLayer.name = "Bottom Fade";
    doc.activeLayer = fadeLayer;
    doc.selection.select([
        [0, H - FADE_HEIGHT], [W, H - FADE_HEIGHT],
        [W, H], [0, H]
    ]);
    doc.selection.fill(app.foregroundColor);
    doc.selection.deselect();
    fadeLayer.opacity = FADE_OPACITY;

    // --- LINE 2 (white, bottom) ---
    var line2Layer = doc.artLayers.add();
    line2Layer.kind = LayerKind.TEXT;
    line2Layer.name = "Line2 – White";
    var t2 = line2Layer.textItem;
    t2.contents = LINE2;
    t2.size = new UnitValue(FONT_SIZE, "pt");
    t2.tracking = TRACKING;
    t2.antiAliasMethod = AntiAlias.SMOOTH;
    t2.justification = Justification.LEFT;

    var wc = new SolidColor();
    wc.rgb.red = WHITE[0]; wc.rgb.green = WHITE[1]; wc.rgb.blue = WHITE[2];
    t2.color = wc;

    try { t2.font = FONT; } catch (e) { t2.font = FONT_FALLBACK; }
    // Position: bottom-left
    var line2Y = H - MARGIN_BOTTOM;
    t2.position = [new UnitValue(MARGIN_LEFT, "px"), new UnitValue(line2Y, "px")];

    // --- LINE 1 (orange, above line 2) ---
    var line1Layer = doc.artLayers.add();
    line1Layer.kind = LayerKind.TEXT;
    line1Layer.name = "Line1 – Orange";
    var t1 = line1Layer.textItem;
    t1.contents = LINE1;
    t1.size = new UnitValue(FONT_SIZE, "pt");
    t1.tracking = TRACKING;
    t1.antiAliasMethod = AntiAlias.SMOOTH;
    t1.justification = Justification.LEFT;

    var oc = new SolidColor();
    oc.rgb.red = ORANGE[0]; oc.rgb.green = ORANGE[1]; oc.rgb.blue = ORANGE[2];
    t1.color = oc;

    try { t1.font = FONT; } catch (e) { t1.font = FONT_FALLBACK; }
    // Position: above line 2 (FONT_SIZE in pt ≈ px at 72dpi, scale for baseline offset)
    var line1Y = line2Y - FONT_SIZE * 1.15 - LINE_GAP;
    t1.position = [new UnitValue(MARGIN_LEFT, "px"), new UnitValue(line1Y, "px")];

    // Move text layers to top
    line1Layer.move(doc.artLayers[0], ElementPlacement.PLACEBEFORE);
    line2Layer.move(doc.artLayers[0], ElementPlacement.PLACEBEFORE);

    app.preferences.rulerUnits = origRuler;
    app.preferences.typeUnits = origType;
})();
