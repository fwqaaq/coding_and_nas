#include <stdlib.h>

struct NamedPoint {
  double x, y;
  char *name;
};

struct NamedPoint *makeNamedPoint(double x, double y, char *name) {
  struct NamedPoint *p = malloc(sizeof(struct NamedPoint));
  p->x = x;
  p->y = y;
  p->name = name;
  return p;
}

void setName(struct NamedPoint *np, char *name) { np->name = name; }
char *getName(struct NamedPoint *np) { return np->name; }