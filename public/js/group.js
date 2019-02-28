const token = document.cookie.split('token=Bearer%20')[1];
const socket = io(`http://localhost:3000?token=Bearer ${token}`);
let groupId;

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};

function loadGroup() {
  socket.emit('gettingGroup', {}, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      document.querySelector('.top-content p').innerHTML = data[0].name;

      const boxChat = document.querySelector('.list-user');

      for (let item of data) {//show all group
        boxChat.insertAdjacentHTML('beforeend', `<li data-group-id=${item._id}>
        <i class="fas fa-circle"></i>${item.name}
        </li>`);
      };

      groupId = document.querySelector('.list-user li').dataset.groupId;

      socket.emit('joiningGroup', {
        groupId
      }, function (error, data) {
        if (error) {
          console.log(error);
        } else {
          socket.emit('loadingMessages', {
            id: groupId,
            token
          });
        }
      });
    };
  });
};

function getGroup(event) {
  ({ groupId } = event.target.dataset);
  const nameGroup = event.target.innerHTML;
  document.querySelector('.top-content p').innerHTML = nameGroup;
  socket.emit('joiningGroup', {
    groupId
  }, handleEvent);
  socket.emit('loadingMessages', {
    id: groupId,
    token
  });
  while (hisMessage.firstChild) {
    hisMessage.removeChild(hisMessage.firstChild);
  };
};

const boxChat = document.querySelector('.list-user');
boxChat.addEventListener('click', getGroup);

