package com.fluentooapp.fluentoo.util;

import java.util.Random;

public class RandomColor {

    private static final Random RANDOM = new Random();

    /**
     * Generates a random color in the RGBA format.
     *
     * @return A string representing the color in RGBA format.
     */
    public static String generateRandomColor() {
        int red = RANDOM.nextInt(256);
        int green = RANDOM.nextInt(256);
        int blue = RANDOM.nextInt(256);
        return String.format("rgba(%d,%d,%d,1)", red, green, blue);
    }
}
