using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI;
using hunter_warfield.WebAPI.Controllers;

namespace hunter_warfield.server.Tests.Controllers
{
    [TestClass]
    public class NotesControllerTest
    {
        private const Int64 id = 134209957;
        private const Int64 debtorId = 4465564;

        // Mock up test Http requests
        private static void SetupControllerForTests(ApiController controller)
        {
            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/Notes");
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary { { "controller", "Notes" } });

            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties.Add(HttpPropertyKeys.HttpRouteDataKey, routeData);
        }

        [TestMethod]
        public void GetNotesDto()
        {
            // Arrange
            NotesController controller = new NotesController();

            // Act
            var result = controller.Get();

            // Assert
            Assert.IsNotNull(result.FirstOrDefault().DebtorId);
        }

        [TestMethod]
        public void GetNotesDtoById()
        {
            // Arrange
            NotesController controller = new NotesController();

            // Act
            var result = controller.Get(id);

            // Assert
            Assert.AreEqual(debtorId, result.DebtorId);
        }

        [TestMethod]
        public void PostNotesDto()
        {
            // Arrange
            NotesController controller = new NotesController();
            SetupControllerForTests(controller);

            //// Act
            var note = new NoteDto();
            note.ActionCode = 190;
            note.ResultCode = 202;
            note.DebtorId = 4103752;
            note.ClientId = 159;

            var result = controller.Post(note);

            // Assert
            Assert.IsTrue(result != null);
        }

        //[TestMethod]
        //public void PutNotesDto()
        //{
        //    // Arrange
        //    NotesController controller = new NotesController();
        //    SetupControllerForTests(controller);

        //    // Act
        //    var note = controller.Get(id);

        //    string message = note.Message;
        //    note.Message = "This is a test";

        //    controller.Put(note);
        //    note = null;

        //    // Assert
        //    var result = controller.Get(id);
        //    Assert.AreEqual("This is a test", result.Message);

        //    result.Message = message;
        //    controller.Put(result);
        //    result = null;

        //    note = controller.Get(id);
        //    Assert.AreEqual(message, note.Message);
        //}

        //[TestMethod]
        //public void DeleteNotesDto()
        //{
        //    // Arrange
        //    NotesController controller = new NotesController();
        //    SetupControllerForTests(controller);

        //    //// Act
        //    var note = new NoteDto();
        //    note.ActionCode = 190;
        //    note.ResultCode = 202;
        //    note.DebtorId = 4103752;
        //    note.ClientId = 159;

        //    var added = controller.Post(note);
        //    var id = added.Id;

        //    controller.Delete(added);

        //    var result = controller.Get(id);

        //    // Assert
        //    Assert.IsTrue(result.Id > 0);
        //}
    }
}
