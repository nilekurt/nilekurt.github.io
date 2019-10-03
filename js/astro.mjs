export function getRV(object, DU, TU) {
    // TODO: Kepler to Canonical RV
    return math.matrix([[1.0], [0.0], [0.0]]);
}

export class Sol {
    constructor() {
        this.name = "Sun";
        this.class = "Start";
        this.children = ["Earth"];

        this.mu = 1.3271244004e20;
        this.radius = 6.95510e9;
    }
}

export class Earth {
    constructor() {
        this.name = "Earth";
        this.class = "Planet";
        this.parent = "Sol";
        this.children = ["Moon"];

        this.mu = 3.9860044e14;
        this.radius = 6.37814e6;

        this.semimajor_axis = 1.49597e11;
        this.eccentricity = 1.671e-2;
        this.longitude_of_ascending_node = 6.08665;
        this.inclination = 8.7e-8;
        this.argument_of_periapsis = 1.9933;
        this.mean_anomaly = 6.23985;
    }
}

export class Moon {
    constructor() {
        this.name = "Moon";
        this.class = "Moon";
        this.parent = "Earth";

        this.mu = 4.90487e12;
        this.radius = 1.7371e6;

        this.semimajor_axis = 3.84400e9;
        this.eccentricity = 5.54e-2;
        this.longitude_of_ascending_node = 2.1831;
        this.inclination = 9.01e-2;
        this.argument_of_periapsis = 5.5528;
        this.mean_anomaly = 2.36091;
    }
}