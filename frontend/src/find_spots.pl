#!/usr/bin/perl -w

$website = "http://timetable.unsw.edu.au/2019/COMP3411.html";
system `wget -q -O- $website