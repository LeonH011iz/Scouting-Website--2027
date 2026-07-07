const table = document.getElementById("tableBody");

fetch("/data")
    .then(response => response.json())
    .then(data => {

        console.log(data);


    data.forEach(row => {

        table.innerHTML += `
        <tr>
            <td>${row.comp}</td>
            <td>${row.teamColor}</td>
            <td>${row.teamNumber + " - " + row.teamName}</td>
            <td>${row.autoLocation}</td>
            <td>${row.autoDo}</td>
            <td>${row.role}</td>
            <td>${row.roleRating}</td>
            <td>${row.aimRating}</td>
            <td>${row.hopperRating}</td>
            <td>${row.shootRating}</td>
            <td>${row.carry}</td>
            <td>${row.travel}</td>
            <td>${row.climb}</td>
            <td>${row.climbLocation}</td>
            <td>${row.disabled}</td>
            <td>${row.dq}</td>
            <td>${row.notes}</td> 
        </tr>
        `;

    });
});