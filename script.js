const handleGetAssignments = async (urls) => {
    const promises = [];

    for (let url of urls) {
        promises.push($.get(url));
    }
    const assignments = await Promise.all(promises);

    return assignments;
};

const handleGetJsonLinks = (courseId, sprint) => {

    const jsonLinks = [];
    const anchorTagClasses =
        "assignment-name";
    const anchorTags = document.getElementsByClassName(anchorTagClasses);
    for (let index in anchorTags) {
        const anchorTag = anchorTags[index];
        const splitedHrefLink = String(anchorTag["href"]).split("/");
        const assignmentId = splitedHrefLink.pop();

        if (assignmentId !== "undefined") {

            const titulo = anchorTag.textContent;
            if (
                !titulo.includes("Extra") &&
                !titulo.includes("Presença") &&
                titulo.includes(`S${sprint}`)
            ) {
                console.log(titulo);
                jsonLinks.push(
                    `https://alunos2.kenzie.com.br/courses/${courseId}/gradebook/speed_grader.json?assignment_id=${assignmentId}`
                );
            }

        }
    }
    return jsonLinks;
};

const handleConvertToCsv = (submissions) => {
    const tabeta = [[]];
    let maior = 0;
    for (let assignmentId in submissions) {
        const submission = submissions[assignmentId];
        if (submission.length > maior) {
            maior = submission.length;
        }
        tabeta[0].push(assignmentId);
    }
    for (let index = 1; index < maior; index++) {
        for (let assignmentId in submissions) {
            const submission = submissions[assignmentId];
            if (tabeta[index]) {
                tabeta[index].push(submission.shift());
            } else {
                tabeta[index] = [];
                tabeta[index].push(submission.shift());
            }
        }
    }

    console.log("Conteúdo copiado para área de transferência!");
    return tabeta.map((list) => list.join(",")).join("\n");
};

const handleTreatAssignments = async (courseId) => {
    const submissions = {};
    let assignments = [];
    for (let sprint = 1; sprint <= 8; sprint++) {
        const urls = handleGetJsonLinks(courseId, sprint);
        assignments = await handleGetAssignments(urls);
        for (const assignment of assignments) {
            submissions[assignment.id] = assignment.submissions.reduce(
                (acumulator, submission) => {
                    if (submission.submitted_at) {
                        return [...acumulator, submission.user_id];
                    }
                    return [...acumulator];
                },
                []
            );
        }
    }
    return handleConvertToCsv(submissions);
};

copy(await handleTreatAssignments(99));