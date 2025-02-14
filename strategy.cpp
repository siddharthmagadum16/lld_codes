/*
This is used when design cant be solved only with pure inheritance
Disadvantages faced when solved with inheritance than using composition (strategy patter)
-Code duplication
-redundant code
`
clear explanation of definition: https://youtu.be/v9ejT8FO-7I?t=1957


This pattern is useful when multiple objects share some common behaviours/strategies over each other.
*/

class Sort {
  ISortStrategy strategy;
  public:
    sort(auto begin, auto end) {
      
    }
};

class ISortStrategy {
  public:
    virtual void algo(auto begin, auto end) = 0;
};


class QuickSortStrategy: public ISortStrategy {
  public:
    void algo (auto begin, auto end) {
      // ... algo
    }
};

class MergeSortStrategy: public ISortStrategy {
  public:
    void algo (auto begin, auto end) {
      // ... algo
    }
};

int main () {

}
