import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

class Car {
    String plateNumber;

    public Car(String plateNumber) {
        this.plateNumber = plateNumber;
    }
}

class Stack {
    private final Car[] stackArray;
    private int top;
    private final int capacity;

    public Stack(int size) {
        capacity = size;
        stackArray = new Car[capacity];
        top = -1;
    }

    public void push(Car car) {
        if (!isFull()) {
            stackArray[++top] = car;
        }
    }

    public Car pop() {
        if (!isEmpty()) {
            return stackArray[top--];
        }
        return null;
    }

    public boolean isEmpty() {
        return top == -1;
    }

    public boolean isFull() {
        return top == capacity - 1;
    }

    public boolean contains(String plate) {
        for (int i = 0; i <= top; i++) {
            if (stackArray[i].plateNumber.equals(plate)) {
                return true;
            }
        }
        return false;
    }
}

public class carParking {
    private static final ArrayList<String> results = new ArrayList<>();

    public static void input() {
        Stack parkingLot = new Stack(10);
        Stack tempStack = new Stack(10);

        try {
            File file = new File("cars.txt");
            Scanner sc = new Scanner(file);

            while (sc.hasNext()) {
                String command = sc.next();
                if (!sc.hasNext()) {
                    break;
                }
                String plate = sc.next();
                process(command, plate, parkingLot, tempStack);
            }
            sc.close();
        } catch (FileNotFoundException e) {
            results.add("cars.txt файл олдсонгүй! Файлаа шалгана уу.");
        }
    }

    public static void process(String command, String plate, Stack parkingLot, Stack tempStack) {
        if (command.equals("A")) {
            if (parkingLot.isFull()) {
                results.add("Arrival " + plate + " -> Garage full, this car cannot enter.");
            } else {
                parkingLot.push(new Car(plate));
                results.add("Arrival " + plate + " -> There is room.");
            }
        } else if (command.equals("D")) {
            if (!parkingLot.contains(plate)) {
                results.add("Departure " + plate + " -> This car not in the garage.");
                return;
            }

            int movedCarsCount = 0;
            while (!parkingLot.isEmpty()) {
                Car current = parkingLot.pop();
                if (current.plateNumber.equals(plate)) {
                    break;
                }
                tempStack.push(current);
                movedCarsCount++;
            }

            results.add("Departure " + plate + " -> " + movedCarsCount + " cars moved out.");

            while (!tempStack.isEmpty()) {
                parkingLot.push(tempStack.pop());
            }
        }
    }

    public static void output() {
        for (String result : results) {
            System.out.println(result);
        }
    }

    public static void main(String[] args) {
        input();
        output();
    }
}
