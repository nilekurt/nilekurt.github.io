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

export function orbital_rotation(i, Omega, omega) {
    // Aug(RotZ(Omega)*RotX(i)*RotZ(omega))
    // Trust me, I'm a rocket scientist
    const sin_O = math.sin(Omega);
    const cos_O = math.cos(Omega);
    const sin_o = math.sin(omega);
    const cos_o = math.cos(omega);
    const sin_i = math.sin(i);
    const cos_i = math.cos(i);

    return math.matrix([
        [cos_O * cos_o - sin_O * sin_o * cos_i, -cos_O * sin_o - sin_O * cos_o * cos_i, sin_O * sin_i, 0],
        [sin_O * cos_o + cos_O * sin_o * cos_i, cos_O * cos_o * cos_i - sin_O * sin_o, -cos_O * sin_i, 0],
        [sin_o * sin_i, cos_o * sin_i, cos_i, 0],
        [0, 0, 0, 1]]);
}

export function semiparameter(a, e) {
    return a * (1 - e * e);
}

export function true_anomaly(M, e) {
    return M + (2 * e - 0.25 * e * e * e) * math.sin(M) + 1.25 * e * e * math.sin(2 * M) + 1.08333 * e * e * e * math.sin(3 * M); // + O(e^4)
}

// Adapted from COE2RV (Vallado 2013)
export function COE2R(p, e, i, Omega, omega, nu) {
    const snu = math.sin(nu);
    const cnu = math.cos(nu);
    const common = p / (1 + e * cnu);
    const r_pqw = math.multiply(math.matrix([[cnu], [snu], [0], [0]]), common);
    r_pqw.set([3, 0], 1);
    return math.multiply(orbital_rotation(-i, -Omega, -omega), r_pqw);
}

// Returns the position of an object relative to its parent in the heliocentric ecliptic CS.
export function getR(object, DU, TU) {
    const p = semiparameter(object.semimajor_axis / DU, object.eccentricity);
    return COE2R(p, object.eccentricity, object.inclination, object.longitude_of_ascending_node, object.argument_of_periapsis, true_anomaly(object.mean_anomaly, object.eccentricity));
}

export class Sol {
    constructor() {
        this.name = "Sun";
        this.class = "Star";
        this.children = ["Earth"];

        this.mu = 1.3271244004e20;
        this.radius = 6.95510e9;
    }
}

export class Earth {
    constructor() {
        this.name = "Earth";
        this.class = "Planet";
        this.parent = "Sun";
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

        this.semimajor_axis = 3.84400e8;
        this.eccentricity = 5.54e-2;
        this.longitude_of_ascending_node = 2.1831;
        this.inclination = 9.01e-2;
        this.argument_of_periapsis = 5.5528;
        this.mean_anomaly = 2.36091;
    }
}