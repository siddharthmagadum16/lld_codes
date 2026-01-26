package models;

public class Card {
    private final int number;
    private final int cvv;

    public int getNumber() {
        return number;
    }

    public int getCvv() {
        return cvv;
    }

    public Card(int number, int cvv) {
        this.number = number;
        this.cvv = cvv;
    }
}
