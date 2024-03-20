
#include <stdio.h>
typedef struct {
  void (*log)(const char *msg);
} LoggerOps;

// 实现
void logConsole(const char *msg) { printf("%s\n", msg); }

void logFile(const char *msg) {
  FILE *f = fopen("log.txt", "a");
  if (f) {
    fprintf(f, "%s\n", msg);
    fclose(f);
  }
}

LoggerOps ConsoleLogger = {.log = logConsole};
LoggerOps FileLogger = {.log = logFile};

// 高层模块：只需要传入不同的LoggerOps实例,就可以使用不同的日志记录方式
void processData(const char *data, LoggerOps *logger) {
  //...数据信息
  char *msg = "log message";
  sprintf(msg, "Processing data: %s", data);
  logger->log(msg);
}

int main() {
  processData("hello", &ConsoleLogger);
  processData("world", &FileLogger);
  return 0;
}