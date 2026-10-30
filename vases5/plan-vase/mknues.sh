#!/bin/sh
# lab/nues_plan.html: the QA page (mkqa.sh) plus vases5/plan-vase/nues_plan.js (bare stem with and without the vessel plan)
cd "$(dirname "$0")/../.."
sed 's#</script></body></html>#;\n#' lab/qa13.html > lab/nues_plan.html && cat vases5/plan-vase/nues_plan.js >> lab/nues_plan.html && echo '</script></body></html>' >> lab/nues_plan.html
tail -c 200 lab/nues_plan.html | head -c 0; echo ok
