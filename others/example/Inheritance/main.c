#include "../encapsulation/encapsulation.h"
#include "./Inheritance.h"
#include <stdio.h>

int main() {
  struct NamedPoint *origin = makeNamedPoint(0.0, 0.0, "origin");
  struct NamedPoint *upperRight = makeNamedPoint(1.0, 1.0, "upper right");
  printf("distance = %f \n",
         distance((struct Point *)origin, (struct Point *)upperRight));
}