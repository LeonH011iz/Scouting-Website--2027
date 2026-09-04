const table = document.getElementById("tableBody");

const params = new URLSearchParams(window.location.search);
const comp = params.get("comp");

fetch("/search-submit?comp=" + encodeURIComponent(comp))
    .then(response => response.json())
    .then(data => {

        console.log(data);

        data.forEach(row => {
            table.innerHTML += `
                <tr>
                    <td>${row.team}</td>
                    <td>${row.autoLocation.replaceAll(',', ' ')}</td>
                    <td>${row.autoDo.replaceAll(',', ' ')}</td>
                    <td>${row.role.replaceAll(',', ' ')}</td>
                    <td>${row.roleRating + "/5"}</td>   
                    <td>${row.aimRating + "/5"}</td>
                    <td>${row.hopperRating + "/5"}</td>    
                    <td>${row.shootRating + "/5"}</td>        
                </tr>
            `;
        });

    });
        /*  
            <td>${row.carry}</td>
            <td>${row.travel}</td>
            <td>${row.climb}</td>
            <td>${row.climbLocation}</td>
            <td>${row.disabled}</td>
            <td>${row.dq}</td>
            <td>${row.notes}</td> 
        
*/