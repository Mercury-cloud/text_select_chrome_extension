(function(){
    // var textarea = document.querySelector("#strings");
    // console.log("Getting options");
    var template = document.querySelector("#template").innerHTML;
    var container = document.querySelector("#strings");

    document.querySelector("#add-regex").addEventListener("click", function () {addRegex()});

    function initListeners(node) {
        node.querySelector(".remove").addEventListener("click", function() {
            node.remove();
        });
    }

    function addRegex(name, value, checked) {
        name = name || "";
        value = value || "";
        var wrapper = document.createElement("span");
        wrapper.innerHTML = template;
        var node = wrapper.childNodes[1];
        node.querySelector(".name").value = name;
        node.querySelector(".value").value = value;
        node.querySelector(".is_checked").checked = checked;
        initListeners(node);
        container.appendChild(node);
    }

    chrome.runtime.sendMessage({method: "getOptions", keys: ["regexes"]}, function(res) {
        // , "notification_position"
        // document.querySelector("#pos").value = res.notification_position;
        if(!Array.isArray(res.regexes)) {
          res.regexes = [];
        }
        res.regexes.forEach(function (kv) {
          addRegex(kv.name, kv.value, kv.checked);
        })
    });

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        var formData = new FormData(e.currentTarget);

        let names = formData.getAll("name[]");
        let values = formData.getAll("value[]");
        let checked = formData.getAll("is_checked[]");
        var keyValues = [];

        console.log(names, values, checked);

        names.forEach(function(name,i) {
            if(names[i].trim()==="" || values[i].trim() === "") return;
            keyValues.push({
                name: name,
                value: values[i],
                checked: checked[i]
            })
        });

        // var notification_position = document.querySelector("#pos").value;
        // , notification_position: notification_position
        chrome.runtime.sendMessage({method: "setOptions", data: {regexes: keyValues}}, function() {
            alert("Successfully Saved");
        });

    });
})();