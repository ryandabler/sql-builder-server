const columns = [
    "id",
    "user_email",
    "user_first_name",
    "user_last_name",
    "screen_width",
    "screen_height",
    "visits",
    "page_response",
    "domain",
    "path"
];

const predicatesToColumns = {
    "User email": "user_email",
    "Screen width": "screen_width",
    "Screen height": "screen_height",
    "# of visits": "visits",
    "First name": "user_first_name",
    "Last name": "user_last_name",
    "Page response time (ms)": "page_response",
    "Domain": "domain",
    "Path": "path"
};

function resolveCondition(predicate, condition, value1, value2) {
    const col = predicatesToColumns[predicate];
    let all;

    switch (condition) {
        case "starts with":
            return `INSTR(${col}, '${value1}')=1`;

        case "does not start with":
            return `INSTR(${col}, '${value1}')<>1`;

        case "equals":
            return `${col}='${value1}'`;
        
        case "does not equal":
            return `${col}<>'${value1}'`;

        case "contains":
            return `INSTR(${col}, '${value1}')>0`;

        case "does not contain":
            return `INSTR(${col}, '${value1}')=0`;

        case "in list":
            all = value1
                .split(/\s*,\s*/g)
                .map(item => `'${item}'`)
                .join(",");
            return `${col} IN (${all})`;

        case "not in list":
            all = value1
                .split(/\s*,\s*/g)
                .map(item => `'${item.trim}'`)
                .join(",");
            return `${col} NOT IN (${all})`;

        case "contains all":
            return `(${value1
                .split(/\s*,\s*/g)
                .map(item =>
                    resolveCondition(predicate, "contains", item, value2)
                )
                .join(" OR ")})`;
        
        case "less than or equal to":
            return `${col}<=${value1}`;
        
        case "equal to":
            return `${col}=${value1}`;
        
        case "not equal to":
            return `${col}<>${value1}`;

        case "greater than or equal to":
            return `${col}>=${value1}`;

        case "between":
            return `${col} BETWEEN ${value1} AND ${value2}`;
    }
}

function buildSQL(query) {
    const where = query.map(_query => 
        resolveCondition(_query.predicate, _query.condition, _query.values, _query.values2)
    );

    return `SELECT ${columns.join(", ")} FROM session WHERE ${where.join(" AND ")}`;
}

module.exports = { buildSQL };