/*
 * Add orange border - rounded TOP corners, square BOTTOM corners (Fab card style)
 * 
 * File → Scripts → Browse → select this file
 */

(function () {
    if (!app.documents.length) { alert("Open an image first!"); return; }

    var doc = app.activeDocument;
    var W = doc.width.as("px");
    var H = doc.height.as("px");

    var origRuler = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;

    // --- CONFIG ---
    var BORDER = 28;            // border thickness (4K)
    var CORNER_RADIUS = 102;    // top corner radius (4K) - ~28px at 1080p, matches Fab card roundness
    var COLOR = [208, 124, 38]; // #d07c26
    var ARC_STEPS = 24;         // smoothness of rounded corners
    // --------------

    // Helper: generate arc points in screen coords (y-down)
    // Sweeps from startDeg to endDeg around (cx, cy) with radius r
    function arcPts(cx, cy, r, startDeg, endDeg, n) {
        var pts = [];
        for (var i = 0; i <= n; i++) {
            var a = (startDeg + (endDeg - startDeg) * i / n) * Math.PI / 180;
            pts.push([Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))]);
        }
        return pts;
    }

    var c = new SolidColor();
    c.rgb.red = COLOR[0]; c.rgb.green = COLOR[1]; c.rgb.blue = COLOR[2];
    app.foregroundColor = c;

    // 1. Create layer filled with border color
    var borderLayer = doc.artLayers.add();
    borderLayer.name = "Orange Border";
    doc.activeLayer = borderLayer;
    doc.selection.selectAll();
    doc.selection.fill(app.foregroundColor);
    doc.selection.deselect();

    // 2. Build interior cutout polygon
    //    Top corners: rounded arcs    Bottom corners: square
    var B = BORDER;
    var R = CORNER_RADIUS;
    var sel = [];

    // Bottom-left (square)
    sel.push([B, H - B]);

    // Bottom-right (square)
    sel.push([W - B, H - B]);

    // Right edge up to start of top-right arc
    sel.push([W - B, B + R]);

    // Top-right arc: center (W-B-R, B+R)
    // Screen coords: 0° = right, -90° = up
    // Sweep from 0° to -90° (right edge → top edge)
    var trArc = arcPts(W - B - R, B + R, R, 0, -90, ARC_STEPS);
    for (var i = 1; i < trArc.length; i++) sel.push(trArc[i]);

    // Top-left arc: center (B+R, B+R)
    // Sweep from -90° to -180° (top edge → left edge)
    var tlArc = arcPts(B + R, B + R, R, -90, -180, ARC_STEPS);
    for (var i = 1; i < tlArc.length; i++) sel.push(tlArc[i]);

    // Left edge down to bottom-left (closes the polygon)
    sel.push([B, B + R]);

    // 3. Select the interior cutout and delete
    doc.selection.select(sel);
    doc.selection.clear();
    doc.selection.deselect();

    // 4. Move to top of layer stack
    borderLayer.move(doc.artLayers[0], ElementPlacement.PLACEBEFORE);

    app.preferences.rulerUnits = origRuler;
})();
