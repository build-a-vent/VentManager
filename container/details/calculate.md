Vorschlag zur Schnittstelle zwischen App und Beatmer
Motivation : Es ist IMHO für den Bediener einfacher, eine unplausible Konfiguration in der 
App angezeigt zu bekommen und nicht auf den Beatmer schieben zu können, als eine abgewiesene Konfig
auf ihre Probleme untersuchen zu müssen. 
Konzept : Der Beatmer denkt zur Steuerung nur in millisekunden. er kennt (neben anderen, hier nicht behandelten werten wie alarmen)
c_airt  : die Zeit, die in der Einatmung das Luftventil offen ist
c_o2t   : die Zeit, die in der Einatmung Sauerstoff offen ist
c_inspt : die Zeit, die während der Einatmung das Ausatemventil geschlossen gehalten wird.
c_cyclt : die Zykluszeit
dazu liefert er noch
c_flair : die Rate, mit der Luft geliefert wird bei offenem Luftventil (typ 750ml/sec, konfigurabel)
c_flo2  : die Rate, mit der O2 geliefert wird. (ml/sec ebenso 750 ml/sec default)
Im Gegensatz zu Konnis Simulator kennt das json Interface also NICHT
  fio_pct
  b_rat
  cyc_min
  tidal_ml
Daraus kann die App sich Minutenvolumen, Tidalvolumen, Ratio, RPM und FIO2 rechnen :
   my $tv    =  $c_o2t * $c_flo2 + $c_airt * $c_flair; _> tidal volumen
   my $fio2  = ($c_o2t * $c_flo2 + $c_airt * $c_flair * 0.2) / $tv;  -> Oxygen content
   my $rpm   = 60000 / $c_cyclt; -> Cycles min
   my $ratio = $c_inspt / $c_cyclt; -> Breath ratio
   my $mv    = $tv * $rpm* 0.001; minutes vvolume
Im Edit-Overlay kann der Bediener 10 Events auslösen - je Parameter Plus und Minus.
Die Events beeinflussen i.d.R mehr als einen Parameter. Ich schlage vor :
* Ändern Minutenvolumen ändert das Tidalvolumen gleichsinnig mit, RPM bleibt konstant. Ratio wird evtl geändert. Grenze 
* Ändern RPM ändert das Tidalvolumen gegensinnig, Minutenvolumen bleibt konstant. Ratio bleibt konstant. 
* Ändern Tidalvolumen ändert auch RPM, Minutenvolumen und Ratio bleiben konstant. Könnte entfallen, das gleiche Ergebnis kann ich auch über RPM erzielen
* Ratio ändert nur Ratio, c_inspt darf nicht kleiner als (c_airt+c_o2t) werden, auch nicht kleiner als 33% von c_cyclt, und nicht größer als 66% c_cyclt
* FIO2 ändert nur FIO2. Wenn beide Drosseln (Luft und O2) gleichen Volumenstrom liefern, verschiebt sich durch ändern FIO2 nur das Zeitverhältnis c_airt 
  zu c_o2t, deren   Summe bleibt konstant.
Einzeloperationen : 
MinutenvolumenPlus (250ml)
   my $tv = $neuesMinVol / $rpm;
   my $c_inspt = $c_cyclt * $ratio;
   my $c_airt = $tv * (1.0 - $fio2) / ($c_flair * 0.8);
   my $c_o2t = ($tv * $fio2 - 0.2 * $flow_air * $c_airt) / $flow_o2;
   if (($c_airt + $c_o2t) > $c_inspt ) {
       my $newratio = ($c_airt + $c_o2t) / $c_cyclt;
       if ($newratio > 0.666) {
          // Minutenvolumen blinkt rot, Ratio blinkt rot, keine Wertänderung
       } else {
         $c_inspt = $c_airt+$c_o2t
         $ratio = $newratio;
         // markiere Minutenvolumen, Tidalvolumen und Ratio als geändert
       }
     } else {
       // markiere Tidalvolumen und Minutenvolumen als geändert.
       // hier könnte auch auf Überschreitung sinnvolles Tidalvolumen gecheckt werden
     }
MinutenvolumenMinus (-250ml)
   my $tv = $neuesMinVol / $rpm;
   my $c_inspt = $c_cyclt * $ratio;
   my $c_airt = $tv * (1.0 - $fio2) / ($c_flair * 0.8);
   my $c_o2t = ($tv * $fio2 - 0.2 * $flow_air * $c_airt) / $flow_o2;
   // Kontrolle auf Unterschreitung sinnvolles Tidalvolumen : 4ml/Hub * 30 kg sind ca 120 ml
   // Markiere Minutenvolumen und Tidalvolumen geändert.
RPM_Plus / RPM_Minus
   my $c_cyclt = 60000/ NeuesRPM;
   my $tv = MinVol / NeuesRPM;
   my $c_inspt = $c_cyclt * $ratio;
   my $c_airt = $tv * (1.0 - $fio2) / ($c_flair * 0.8);
   my $c_o2t = ($tv * $fio2 - 0.2 * $flow_air * $c_airt) / $flow_o2;
   // Kontrolle auf Unterschreitung sinnvolles Tidalvolumen : 4ml/Hub * 30 kg sind ca 120 ml
   // Markiere RPM und Tidalvolumen geändert.
fio2 Plus oder Minus
   //Einstellgrenzen 0.21 = 21% und 95 % = 0.95 nicht überschreiten, sonst droht division by zero
   my $c_airt = $tv * (1.0 - $fio2) / ($c_flair * 0.8);
   my $c_o2t = ($tv * $fio2 - 0.2 * $flow_air * $c_airt) / $flow_o2;
   // fio als geändert markieren
Ratio plus minus
   // grenzen ermitteln, nicht über 66%, nicht unter 33%
   my $c_inspt = $c_cyclt * $ratio;
   if ($c_inspt < (c_airt + c_o2t)) ) {
     //RPM blinkt rot, Ratio blinkt rot, keine Wertänderung
   } else {
     // RPM geändert markieren
