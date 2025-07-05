/*
This is used when design cant be solved only with pure inheritance
Disadvantages faced when solved with inheritance than using composition (strategy pattern)
-Code duplication
-redundant code

clear explanation of definition: https://youtu.be/v9ejT8FO-7I?t=1957

This pattern is useful when multiple objects share some common behaviours/strategies over each other.
*/

// Sort Strategy Interface
interface ISortStrategy<T> {
    algo(arr: T[]): T[];
}

// Quick Sort Strategy
class QuickSortStrategy<T> implements ISortStrategy<T> {
    algo(arr: T[]): T[] {
        // Quick sort implementation
        if (arr.length <= 1) return arr;

        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter((x, i) => i !== Math.floor(arr.length / 2) && x < pivot);
        const right = arr.filter((x, i) => i !== Math.floor(arr.length / 2) && x >= pivot);

        return [...this.algo(left), pivot, ...this.algo(right)];
    }
}

// Merge Sort Strategy
class MergeSortStrategy<T> implements ISortStrategy<T> {
    algo(arr: T[]): T[] {
        // Merge sort implementation
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = this.algo(arr.slice(0, mid));
        const right = this.algo(arr.slice(mid));

        return this.merge(left, right);
    }

    private merge(left: T[], right: T[]): T[] {
        const result: T[] = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        return result.concat(left.slice(i)).concat(right.slice(j));
    }
}

// Sort class using strategy pattern
class Sort<T> {
    private strategy: ISortStrategy<T>;

    constructor(strategy: ISortStrategy<T>) {
        this.strategy = strategy;
    }

    sort(arr: T[]): T[] {
        return this.strategy.algo(arr);
    }

    setStrategy(strategy: ISortStrategy<T>): void {
        this.strategy = strategy;
    }
}

// Main function
function main(): void {
    const numbers = [64, 34, 25, 12, 22, 11, 90];

    // Using Quick Sort
    const quickSort = new Sort(new QuickSortStrategy<number>());
    console.log("Quick Sort:", quickSort.sort([...numbers]));

    // Using Merge Sort
    const mergeSort = new Sort(new MergeSortStrategy<number>());
    console.log("Merge Sort:", mergeSort.sort([...numbers]));
}

// Execute main
main();