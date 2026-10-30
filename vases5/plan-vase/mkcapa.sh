#!/bin/sh
# lab/capa_plan.html: the QA page (mkqa.sh) plus vases5/plan-vase/capa_plan.js (the catalogue models against their vessels' necks)
cd "$(dirname "$0")/../.."
sed 's#</script></body></html>#;\n#' lab/qa13.html > lab/capa_plan.html && cat vases5/plan-vase/capa_plan.js >> lab/capa_plan.html && echo '</script></body></html>' >> lab/capa_plan.html
tail -c 200 lab/capa_plan.html | head -c 0; echo ok
