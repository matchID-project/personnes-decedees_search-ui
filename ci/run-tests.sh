#!/bin/bash
basename=$(basename $0)
ret=1
echo "# build all/run/test all"
time make -f Makefile build || exit $?

