/***************************************************
An online solver for Lambert's problem
Copyright (C) 2019 Kim Nilsson

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
***************************************************/

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