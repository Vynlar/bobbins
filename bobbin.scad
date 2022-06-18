$fa = 1;
$fs = 0.4;
height = 38;
width = 27;
depth = 1.5;
circle = 7;
code = "DB5340";
font = "Arial Bold";

union() {
    difference() {
        linear_extrude(height=depth)
        difference() {
            union() {
                square([width, height]);
                translate([0, circle/2])
                    circle(r=circle/2);
                translate([width, circle/2])
                    circle(r=circle/2);
                translate([width, height - circle/2])
                    circle(r=circle/2);
                translate([0, height - circle/2])
                    circle(r=circle/2);
            }
            translate([width/2, circle/2+1.5])
                circle(r=circle/2);
            translate([2, 0]) rotate(-35) square([0.5, 8]);
            translate([width-2, 0]) rotate(35) translate([-0.5, 0]) square([0.5, 8]);
        }
    }


    linear_extrude(height=depth * 1.5) translate([width/2, height-3, depth])
        rotate(180)
        text(text=code, size=4, halign="center", valign="center", font=font);
}
