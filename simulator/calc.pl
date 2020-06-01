#!/usr/bin/perl
​
​
sub limiter($$$) {
  my ($val,$minv,$maxv) = @_;
  if ($val < $minv) { return $minv; }
  if ($val > $maxv) { return $maxv; }
  return $val;
}
​
# konfigurierte volumenströme für luft und o2
my $flow_air = 0.75; # l/sec
my $flow_o2  = 0.75;
​
my $cmd     = shift(@ARGV);
​
if ($cmd eq 'totime') {         # from mv+rpm+ratio+fio2 to times
​
   my $mv    = shift(@ARGV);   #minute vol in ltr
   my $rpm   = shift(@ARGV);   #RPM !!
   my $ratio = shift(@ARGV);   #inspirtime / cycletime .333 ... .666
   my $fio2  = shift(@ARGV);
​
   # eingaben sinnvoll limitieren
​
   $mv    = limiter($mv,5,40);
   $rpm   = limiter($rpm,15,30);
   $ratio = limiter($ratio,0.333,0.666);
   $fio2  = limiter($fio2,0.21,0.95);
   
   
   my $c_cyclet = 60 / $rpm;  # in seconds
   my $tv = $mv / $rpm;       # tidal volume in ltr
   
   my $c_inspt = $c_cyclet * $ratio;
   
   # 80% of air is NOT o2
   #
   # TidVol * (1-FIO2) = 0.8 * (flow_air * time_air)
   # volume which is   = non-o2  air volume
   # not o2
   
   my $c_airt = $tv * (1.0 - $fio2) / ($flow_air * 0.8);
   
   #
   # 20% of air + pure o2 = sum o2
   #
   # TidVol * FIO2 = 0.2 * flow_air * c_airt
   #               +       flow_o2  * c_o2t
   # o2 volume     = sum of o2 in air and o2
   #
   # c_o2t = (TidVol * FIO2 - 0.2 * flow_air * c_airt) / flow_o2
   
   my $c_o2t = ($tv * $fio2 - 0.2 * $flow_air * $c_airt) / $flow_o2;
   
   #
   # check auf realisierbarkeit ratio :
   #
   if (($c_airt + $c_o2t) > $c_inspt ) {
     my $newratio = ($c_airt + $c_o2t) / $c_cyclet;
     if ($newratio > 0.666) {
        printf ("!!!! Tidalvolumen kann nicht realisiert werden, mehr RPM bitte\n");
     } else {
       printf ("!!!! Ratio muss angehoben werden\n");
     }
     $ratio = $newratio;
   }
   
   
   printf ("MinV   : %4.1f, TidV  : %4.2f, Ratio     : %4.2f, RPM      : %4.1f\nFIO2   : %4.2f\n",
           $mv,$tv,$ratio,$rpm,$fio2);
   printf ("air_ms : %4d, o2_ms : %4d, inspir_ms : %4d, cycle_ms : %4d\n",
            $c_airt*1000, $c_o2t * 1000, $c_inspt * 1000, $c_cyclet * 1000);
   printf ("air_ml : %4d, o2_ml : %4d, tv        : %4d\n",
            $c_airt * $flow_air * 1000, $c_o2t * $flow_o2 * 1000, $tv * 1000);            
}
​
if ($cmd eq 'toval') {         # from mv+rpm+ratio+fio2 to times
​
   my $c_airt    = shift(@ARGV);   #millisecs air valve open
   my $c_o2t     = shift(@ARGV);   #millisecs oxygen open
   my $c_inspt   = shift(@ARGV);   #inspirtime / cycletime .333 ... .666
   my $c_cyclet  = shift(@ARGV);
   
   # eingaben sinnvoll limitieren
   
   $c_o2t    = limiter ($c_o2t,      0, 1500);
   $c_airt   = limiter ($c_airt,   250, 1500 - $c_o2t); # min 250 ms=187ml for a 30kg Person @ 6ml/kg
   $c_cyclet = limiter ($c_cyclet,2000, 4000); # 15..30 RPM
   $c_inspt  = limiter ($c_inspt, $c_o2t+$c_airt,$c_cyclet);
   
   # rechnen
   
   my $tv    =  $c_o2t * $flow_o2 + $c_airt * $flow_air;
   my $fio2  = ($c_o2t * $flow_o2 + $c_airt * $flow_air * 0.2) / $tv;
   my $rpm   = 60000 / $c_cyclet;
   my $ratio = $c_inspt / $c_cyclet;
   my $mv    = $tv * $rpm*.001;
   
   # check auf legale ratio
   if (($ratio < 0.333) || ($ratio > 0.666)) {
        printf ("!!!! KRITISCHE RATIO !!!!!!! \n");
   }
   printf (" air ms : %4d, o2 ms : %4d, insp.ms : %4d, cycl.ms : %4d\n",
            $c_airt,$c_o2t,$c_inspt,$c_cyclet);
   printf (" air ml : %4d, o2 ml : %4d, tv ml   : %4d, mv ltr  : %4.1f\n",
            $c_airt*$flow_air,$c_o2t*$flow_o2,$tv,$mv);
   printf (" ratio  : %4.2f, rpm   : %4.1f, fio2    : %4.2f\n",$ratio,$rpm,$fio2);            
} 