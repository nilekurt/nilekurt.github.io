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

// Produces an array [0..n-1]
export function range(n) {
    return Array.from({ length: n }, (value, key) => key);
}

// Generates a dim(xs) by dim(xs) translation matrix
export function translate(xs) {
    const len = xs.size()[0] - 1;
    const m = math.identity(len + 1);
    const translation = math.subset(m, math.index(range(len), len), math.subset(xs, math.index(range(len), 0)));
    return translation;
}

export function position(m) {
    return math.subset(m, math.index(range(4), 3));
}