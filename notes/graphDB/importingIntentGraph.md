CREATE CONSTRAINT ON (c:Intent) ASSERT c.name IS UNIQUE;
CREATE CONSTRAINT ON (c:Term) ASSERT c.name IS UNIQUE;

# create constraint by loading CSV
# @TODO

# Create nodes from the CSV uniquely

### Creates all nodes from the CSV, for the mentioned node type
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line
WITH Line
WHERE Line.`node type` = 'term'
MERGE (n:Term {name:Line.name})
SET n.nodeid = Line.`node id`
return n

### Creates all nodes from the CSV, for the mentioned node type
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line
WITH Line
WHERE Line.`node type` = 'intent'
MERGE (n:Intent {name:Line.name})
SET n.nodeid = Line.`node id`
return n

### Creates all nodes from the CSV, for the mentioned node type
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line
WITH Line
WHERE Line.`node type` = 'domain'
MERGE (n:Domain {name:Line.name})
SET n.nodeid = Line.`node id`
return n

### Creates all nodes from the CSV, you need add one FOREACH clause for each node type, which is possible in the CSV
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line 
WITH Line
WHERE Line.`node type` IS NOT NULL
FOREACH(ignoreMe IN CASE WHEN Line.`node type` = 'term' THEN [1] ELSE [] END | MERGE (n:Term {name:Line.name}) SET n.nodeid = Line.`node id`)
FOREACH(ignoreMe IN CASE WHEN Line.`node type` = 'intent' THEN [1] ELSE [] END | MERGE (n:Intent {name:Line.name}) SET n.nodeid = Line.`node id`)

# -- END of Creating Nodes ---

# Create relationship among intent-intent, term-term and term-intent

### Create intent-intent relations

LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line
WITH Line
WHERE Line.`node type` IS NOT NULL
MATCH (i:Intent {name:Line.name})
MATCH (pi:Domain {nodeid:Line.`parent node id`})
call apoc.create.relationship(i, Line.`parent relation`,{weight:Line.weight}, pi) YIELD rel as r
return i,pi,r


### Create term-intent relations

LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line
WITH Line
WHERE Line.`node type` IS NOT NULL
MATCH (n:Term {name:Line.name})
MATCH (pn:Intent {nodeid:Line.`parent node id`})
call apoc.create.relationship(n, Line.`parent relation`,{weight:Line.weight}, pn) YIELD rel as r
return n, pn, r

### Create term-term relations

LOAD CSV WITH HEADERS FROM "file:///javaConceptsToIntent.csv" AS Line
WITH Line
WHERE Line.`node type` IS NOT NULL
MATCH (n:Term {name:Line.name})
MATCH (pn:Term {nodeid:Line.`parent node id`})
call apoc.create.relationship(n, Line.`parent relation`, {weight:Line.weight}, pn) YIELD rel as r
return n, pn, r


