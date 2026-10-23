#!/bin/sh
# The whole calibration of the four faces: the fibres' opacity against the photo's grain (3 rounds), the zones' colours and the
# dust (2 rounds, fibres included), the fibres again (1 round), then the pairs.
sh insectes/moro-sphinx/ailes/fibres.sh 3 &&
sh insectes/outils/etalonne.sh moro-sphinx macroglossum 2 "fore upper avant-dessus" "fore under avant-dessous" "hind upper arriere-dessus" "hind under arriere-dessous" >/dev/null &&
sh insectes/moro-sphinx/ailes/fibres.sh 1 &&
sh insectes/moro-sphinx/ailes/paires.sh
