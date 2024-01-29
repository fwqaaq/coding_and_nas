#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

// 多态
struct Move {
  void (*move)(bool sw, int x, int y, ...);
};

struct Point {
  struct Move move;
  int x;
  int y;
};

void move(bool sw, int x, int y, ...) {
  va_list args;
  va_start(args, y);
  int z = va_arg(args, int);
  if (sw) {
    printf("Moving to %d, %d\n", x, y);
  } else {
    printf("Moving to %d, %d, %d\n", x, y, z);
  }
  va_end(args);
}

// new function
struct Point *newPoint(int x, int y) {
  struct Point *p = malloc(sizeof(struct Point));
  p->x = x;
  p->y = y;
  p->move.move = move;
  return p;
}

// drop function
void dropPoint(struct Point *p) { free(p); }

// 多态
struct Point3D {
  struct Move move;
  int x;
  int y;
  int z;
};

struct Point3D *newPoint3D(int x, int y, int z) {
  struct Point3D *p = malloc(sizeof(struct Point3D));
  p->move.move = move;
  p->x = x;
  p->y = y;
  p->z = z;
  return p;
}

void dropPoint3D(struct Point3D *p) { free(p); }

int main() {
  struct Point3D *p = newPoint3D(1, 2, 3);
  p->move.move(false, p->x, p->y, p->z);
  dropPoint3D(p);
}