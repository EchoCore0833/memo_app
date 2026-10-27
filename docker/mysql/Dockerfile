FROM mysql:8.4.8

# Windowsのbind mount権限に依存せず、MySQLが読み込める権限で配置する。
COPY --chmod=0644 my.cnf /etc/mysql/conf.d/my.cnf
