export default class MathHelper {
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    static polarToCartesian(radius, angle) {
        return {
            "x" : radius * Math.cos(-1 * MathHelper.degreesToRadians(angle)),
            "y" : radius * Math.sin(-1 * MathHelper.degreesToRadians(angle))
        };
    }

    static cartesianToPolar(x, y) {
        var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        var angle = MathHelper.radiansToDegrees(Math.atan(y/x));
        if (x < 0) {
            angle += 180;
        } else if (y >= 0) {
            angle += 360;
        }

        angle *= -1;

        while (angle < 0) {
            angle += 360;
        }

        return {
            "radius" : radius,
            "angle" : angle
        }
    }
}