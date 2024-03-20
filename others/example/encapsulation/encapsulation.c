#include "encapsulation.h"
#include <math.h>
#include <stdlib.h>

struct Point {
  double x, y;
};

struct Point *makepoint(double x, double y) {
  struct Point *p = malloc(sizeof(struct Point));
  p->x = x;
  p->y = y;
  return p;
}

double distance(struct Point *p1, struct Point *p2) {
  double dx = p1->x - p2->x;
  double dy = p1->y - p2->y;
  return sqrt(dx * dx + dy * dy);
}