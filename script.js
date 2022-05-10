const handleGetJsonLinks = async (courseId) => {
    const assignments = {};
    const tags = document.getElementsByClassName(
        "fOyUs_bGBk eHiXd_bGBk eHiXd_brAJ eHiXd_doqw eHiXd_bNlk eHiXd_cuTS"
    );

    for (let index in tags) {
        const tag = tags[index];
        const link = String(tag["href"]).split("/");
        const assignmentId = link.pop();
        if (assignmentId !== "undefined") {
            await $.get(
                `https://alunos2.kenzie.com.br/courses/${courseId}/gradebook/speed_grader.json?assignment_id=${assignmentId}`
            ).then((res) => {
                assignments[res.id] = res.submissions
                    .filter((submission) => submission.submitted_at)
                    .map((submission) => submission.user_id);
                return res;
            });
        }
        console.log("Carregando...");
    }
    console.log("Conteúdo copiado para área de transferência!");
    return JSON.stringify(assignments);
};
copy(await handleGetJsonLinks(95));
